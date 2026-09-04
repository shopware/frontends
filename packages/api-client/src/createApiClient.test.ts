import {
  createApp,
  createError,
  eventHandler,
  getHeaders,
  readMultipartFormData,
  setHeader,
  toNodeListener,
} from "h3";
import type { App } from "h3";
import { listen } from "listhen";
import type { Listener } from "listhen";
import { afterAll, describe, expect, it, vi } from "vitest";

import type { operations } from "../api-types/storeApiTypes";
import { createAPIClient } from "./createAPIClient";

describe("createAPIClient", () => {
  const listeners: Listener[] = [];

  async function createPortAndGetUrl(appToCreate: App) {
    try {
      const listener = await listen(toNodeListener(appToCreate), {
        port: {
          portRange: [3600, 3699],
        },
      });
      listeners.push(listener);
      return listener.url;
    } catch (e) {
      console.error("Problem with port. Getting new one...", e);
      return createPortAndGetUrl(appToCreate);
    }
  }

  afterAll(async () => {
    for (const listener of listeners) {
      await listener.close().catch(console.error);
    }
  });

  it("should invoke requests with sw-access-key header and no context-token by default", async () => {
    const firstAppSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        firstAppSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      baseURL,
    });
    await client.invoke("readCart get /checkout/cart");
    expect(firstAppSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-context-token": "",
      }),
    );
  });

  it("should invoke requests with sw-context-token header", async () => {
    const firstAppSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        firstAppSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });
    await client.invoke("readCart get /checkout/cart");

    expect(firstAppSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-access-key": "123",
        "sw-context-token": "456",
      }),
    );
  });

  it("should NOT invoke requests with sw-context-token header when not present", async () => {
    const seoUrlHeadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        seoUrlHeadersSpy(requestHeaders["sw-context-token"]);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      baseURL,
    });
    await client.invoke("readCart get /checkout/cart");

    expect(seoUrlHeadersSpy).toHaveBeenCalledWith(undefined);
  });

  it("should invoke onContextChanged method when context token is changed", async () => {
    const app = createApp()
      .use(
        "/checkout/cart",
        eventHandler(async (event) => {
          const requestHeaders = getHeaders(event);
          setHeader(
            event,
            "sw-context-token",
            String(requestHeaders["sw-context-token"]),
          );
          return {};
        }),
      )
      .use(
        "/context",
        eventHandler(async (event) => {
          setHeader(event, "sw-context-token", "789");
          return {};
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const contextChangedMock = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });
    client.hook("onContextChanged", contextChangedMock);

    await client.invoke("readCart get /checkout/cart");
    expect(contextChangedMock).not.toHaveBeenCalled();
    await client.invoke("readContext get /context");
    expect(contextChangedMock).toHaveBeenCalledWith("789");
  });

  it("should invoke onContextChanged only once", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async (event) => {
        setHeader(event, "sw-context-token", "789");
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const contextChangedMock = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });
    client.hook("onContextChanged", contextChangedMock);

    await client.invoke("readContext get /context");
    expect(contextChangedMock).toHaveBeenCalledOnce();
    expect(contextChangedMock).toHaveBeenCalledWith("789");
  });

  it("should NOT adopt sw-context-token from publicly cacheable responses", async () => {
    // CacheableReads / CDN hits replay Cache-Control: public responses that may
    // still carry a guest sw-context-token from when the entry was stored.
    // Adopting that token would log the user out.
    const app = createApp().use(
      "/language",
      eventHandler(async (event) => {
        setHeader(event, "sw-context-token", "cached-guest-token");
        setHeader(
          event,
          "cache-control",
          "max-age=0, Public, s-maxage=1800, stale-while-revalidate=86400",
        );
        return { elements: [] };
      }),
    );

    const baseURL = await createPortAndGetUrl(app);
    const contextChangedMock = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "logged-in-token",
      baseURL,
    });
    client.hook("onContextChanged", contextChangedMock);

    await client.invoke("readLanguagesGet get /language");

    expect(contextChangedMock).not.toHaveBeenCalled();
    expect(client.defaultHeaders["sw-context-token"]).toEqual(
      "logged-in-token",
    );
  });

  it("should still adopt sw-context-token from private session responses", async () => {
    const app = createApp().use(
      "/account/login",
      eventHandler(async (event) => {
        setHeader(event, "sw-context-token", "post-login-token");
        setHeader(
          event,
          "cache-control",
          "max-age=0, no-cache, private, s-maxage=0",
        );
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);
    const contextChangedMock = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "pre-login-token",
      baseURL,
    });
    client.hook("onContextChanged", contextChangedMock);

    await client.invoke("loginCustomer post /account/login", {
      body: { username: "user", password: "pass" },
    });

    expect(contextChangedMock).toHaveBeenCalledWith("post-login-token");
    expect(client.defaultHeaders["sw-context-token"]).toEqual(
      "post-login-token",
    );
  });

  it("should NOT invoke onContextChanged method when no context header is set in response", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async () => {
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const contextChangedMock = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    client.hook("onContextChanged", contextChangedMock);

    await client.invoke("readContext get /context");
    expect(contextChangedMock).not.toHaveBeenCalled();
  });

  it("should throw error when there is a problem with request", async () => {
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async () => {
        throw createError({
          statusCode: 500,
        });
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      baseURL,
    });

    await expect(() =>
      client.invoke("readCart get /checkout/cart"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[ApiClientError: Failed request]",
    );
  });

  it(`should by default include "Accept" header with "application/json" value`, async () => {
    const seoUrlHeadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        seoUrlHeadersSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    await client.invoke("readCart get /checkout/cart");

    expect(seoUrlHeadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: "application/json",
      }),
    );
  });

  it("should change default headers", async () => {
    const seoUrlheadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        seoUrlheadersSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    client.defaultHeaders.apply({ "sw-language-id": "my-language-id" });
    await client.invoke("readCart get /checkout/cart");

    expect(seoUrlheadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-language-id": "my-language-id",
      }),
    );
  });

  it("should apply headers from the request when overriding default one", async () => {
    const seoUrlheadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        seoUrlheadersSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    client.defaultHeaders.apply({ "sw-language-id": "my-language-id" });
    await client.invoke("readCart get /checkout/cart", {
      headers: {
        "sw-language-id": "my-changed-language-id",
      },
    });

    expect(seoUrlheadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-language-id": "my-changed-language-id",
      }),
    );
  });

  it("should let the runtime set multipart/form-data with a boundary for FormData bodies", async () => {
    const contentTypeSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/core/upload",
      eventHandler(async (event) => {
        const requestHeaders = getHeaders(event);
        contentTypeSpy(requestHeaders);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    const formData = new FormData();
    formData.append("file", new Blob(["file-content"]), "file.txt");

    // @ts-expect-error this endpoint does not exist
    await client.invoke("fileUpload post /core/upload", {
      // a manually set multipart/form-data has no boundary and must be replaced
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    expect(contentTypeSpy).toHaveBeenCalledTimes(1);
    const headers = contentTypeSpy.mock.calls[0]?.[0];
    expect(headers).toBeDefined();
    expect(headers).toMatchObject({
      accept: "application/json",
      "sw-access-key": "123",
      "sw-context-token": "456",
    });
    // The default application/json (and the boundary-less multipart) must be
    // gone, replaced by a runtime-generated multipart/form-data + boundary.
    expect(headers?.["content-type"]).toMatch(
      /^multipart\/form-data; boundary=/,
    );
  });

  it("should deliver a parseable upload even when the caller mislabels it as JSON", async () => {
    // The runtime serializes FormData as multipart and generates the boundary,
    // but that boundary only reaches the server through the Content-Type. An
    // explicit application/json would strand it and the upload would fail
    // silently, so it has to be dropped too.
    const uploadSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/core/upload",
      eventHandler(async (event) => {
        uploadSpy({
          contentType: getHeaders(event)["content-type"],
          parts: await readMultipartFormData(event),
        });
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    const formData = new FormData();
    formData.append("file", new Blob(["file-content"]), "file.txt");

    // @ts-expect-error this endpoint does not exist
    await client.invoke("fileUpload post /core/upload", {
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    });

    expect(uploadSpy).toHaveBeenCalledTimes(1);
    const upload = uploadSpy.mock.calls[0]?.[0];
    expect(upload?.contentType).toMatch(/^multipart\/form-data; boundary=/);
    // the server can actually read the file back out
    expect(upload?.parts).toHaveLength(1);
    expect(upload?.parts?.[0]?.filename).toBe("file.txt");
    expect(upload?.parts?.[0]?.data.toString()).toBe("file-content");
  });

  it("should trigger success callback", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async () => {
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const successCallback = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    client.hook("onSuccessResponse", successCallback);

    await client.invoke("readContext get /context");
    expect(successCallback).toHaveBeenCalled();
  });

  it("should trigger fail callback", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async () => {
        throw createError({ status: 500 });
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const errorCallback = vi.fn().mockImplementation(() => {});

    const client = createAPIClient<operations>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });

    client.hook("onResponseError", errorCallback);

    await expect(
      client.invoke("readContext get /context"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[ApiClientError: Failed request]",
    );

    expect(errorCallback).toHaveBeenCalled();
  });

  it("should allow to abort request", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(createError({ status: 408 }));
          }, 1000 * 2);
        });
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAPIClient<operations>({
      baseURL,
      accessToken: "123",
      contextToken: "456",
    });

    const controller = new AbortController();

    const request = client.invoke("readContext get /context", {
      fetchOptions: {
        signal: controller.signal,
      },
    });

    controller.abort();

    await expect(request).rejects.toThrowErrorMatchingInlineSnapshot(
      `[FetchError: [GET] "${baseURL}context": <no response> This operation was aborted]`,
    );
  });

  describe("fetchOptions", () => {
    it("should enforce the timeout for API requests when a timeout is provided", async () => {
      const app = createApp().use(
        "/slow-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: {
          timeout: 50,
        },
        baseURL,
      });

      await expect(
        // @ts-expect-error this endpoint does not exist
        client.invoke("testTimeout get /slow-endpoint", {}),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[FetchError: [GET] "${baseURL}slow-endpoint": <no response> [TimeoutError]: The operation was aborted due to timeout]`,
      );
    });

    it("should complete request if timeout is not provided and endpoint resolves", async () => {
      const app = createApp().use(
        "/fast-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        baseURL,
      });

      // @ts-expect-error this endpoint does not exist
      const response = await client.invoke("testNoTimeout get /fast-endpoint");

      expect(response).toEqual({
        data: { message: "Request succeeded" },
        status: 200,
      });
    });

    it("should complete request if timeout is larger than the time it took to resolve the request", async () => {
      const app = createApp().use(
        "/fast-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: {
          timeout: 100,
        },
        baseURL,
      });

      // @ts-expect-error this endpoint does not exist
      const response = await client.invoke("testTimeout get /fast-endpoint");

      expect(response).toEqual({
        data: { message: "Request succeeded" },
        status: 200,
      });
    });

    it("should use per-request timeout instead of client default timeout", async () => {
      const app = createApp().use(
        "/override-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: {
          timeout: 100,
        },
        baseURL,
      });

      const response = await client.invoke(
        // @ts-expect-error this endpoint does not exist
        "testOverrideTimeout get /override-endpoint",
        {
          fetchOptions: { timeout: 200 },
        },
      );

      expect(response).toEqual({
        data: { message: "Request succeeded" },
        status: 200,
      });
    });

    it("should fail when per-request timeout is smaller than endpoint response time", async () => {
      const app = createApp().use(
        "/override-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: {
          timeout: 200,
        },
        baseURL,
      });

      await expect(
        // @ts-expect-error this endpoint does not exist
        client.invoke("testOverrideTimeout get /override-endpoint", {
          fetchOptions: { timeout: 100 },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[FetchError: [GET] "${baseURL}override-endpoint": <no response> [TimeoutError]: The operation was aborted due to timeout]`,
      );
    });

    it("exposes a timeout as a FetchError with no status and a TimeoutError cause", async () => {
      const app = createApp().use(
        "/slow-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const error = await client
        // @ts-expect-error this endpoint does not exist
        .invoke("testTimeoutShape get /slow-endpoint", {})
        .catch((caught: unknown) => caught as Error & { status?: number });

      expect(error.name).toBe("FetchError");
      expect(error.status).toBeUndefined();
      expect((error.cause as Error).name).toBe("TimeoutError");
    });

    it("lets a per-request signal replace the client timeout, so a slow request still resolves", async () => {
      const app = createApp().use(
        "/slow-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const controller = new AbortController();

      // ofetch only arms its timeout when no signal is present, so the caller's
      // signal takes over instead of combining with it.
      const response = await client.invoke(
        // @ts-expect-error this endpoint does not exist
        "testSignalWins get /slow-endpoint",
        { fetchOptions: { signal: controller.signal } },
      );

      expect(response).toEqual({
        data: { message: "Request succeeded" },
        status: 200,
      });
    });

    it("aborts through a per-request signal while a client timeout is configured", async () => {
      const app = createApp().use(
        "/slow-endpoint",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        fetchOptions: { timeout: 5000 },
        baseURL,
      });

      const controller = new AbortController();
      const request = client.invoke(
        // @ts-expect-error this endpoint does not exist
        "testSignalAborts get /slow-endpoint",
        { fetchOptions: { signal: controller.signal } },
      );
      controller.abort();

      await expect(request).rejects.toThrow(/aborted/i);
    });
  });

  describe("default header changes", () => {
    it("should invoke headers changed hook", async () => {
      const contextChangedMock = vi.fn();

      const client = createAPIClient<operations>({
        accessToken: "123",
        contextToken: "456",
        baseURL: "",
      });

      client.hook("onDefaultHeaderChanged", contextChangedMock);
      await client.defaultHeaders.apply({ "sw-language-id": "my-language-id" });
      expect(client.defaultHeaders["sw-language-id"]).toEqual("my-language-id");
      expect(contextChangedMock).toHaveBeenCalledWith(
        "sw-language-id",
        "my-language-id",
      );
    });

    it("context token headers change should invoke onContextChanged hook additionally", async () => {
      const contextChangedMock = vi.fn();
      const defaultHeaderChangedMock = vi.fn();

      const client = createAPIClient<operations>({
        accessToken: "123",
        contextToken: "456",
        baseURL: "",
      });

      client.hook("onDefaultHeaderChanged", defaultHeaderChangedMock);
      client.hook("onContextChanged", contextChangedMock);

      await client.defaultHeaders.apply({
        "sw-context-token": "some-new-context-token",
      });

      expect(client.defaultHeaders["sw-context-token"]).toEqual(
        "some-new-context-token",
      );

      expect(defaultHeaderChangedMock).toHaveBeenCalledWith(
        "sw-context-token",
        "some-new-context-token",
      );
      expect(contextChangedMock).toHaveBeenCalledWith("some-new-context-token");
    });
  });

  describe("change of baseConfig", () => {
    it("should change baseUrl, access token and invoke it properly", async () => {
      const firstAppSpy = vi.fn().mockImplementation(() => {});
      const app = createApp().use(
        "/checkout/cart",
        eventHandler(async (event) => {
          const requestHeaders = getHeaders(event);
          firstAppSpy(requestHeaders);
          return {};
        }),
      );

      const anotherAppSpy = vi.fn().mockImplementation(() => {});
      const app2 = createApp().use(
        "/checkout/cart",
        eventHandler(async (event) => {
          const requestHeaders = getHeaders(event);
          anotherAppSpy(requestHeaders);
          return {};
        }),
      );

      const baseURL = await createPortAndGetUrl(app);
      const baseURL2 = await createPortAndGetUrl(app2);

      const client = createAPIClient<operations>({
        accessToken: "123",
        contextToken: "456",
        baseURL,
      });

      await client.invoke("readCart get /checkout/cart");

      expect(firstAppSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          accept: "application/json",
        }),
      );

      client.updateBaseConfig({
        baseURL: baseURL2,
        accessToken: "NEW_TOKEN",
      });

      await client.invoke("readCart get /checkout/cart");

      expect(anotherAppSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          accept: "application/json",
          "sw-access-key": "NEW_TOKEN",
        }),
      );
    });

    it("should update only access token without recreating the fetch client", async () => {
      const appSpy = vi.fn().mockImplementation(() => {});
      const app = createApp().use(
        "/checkout/cart",
        eventHandler(async (event) => {
          const requestHeaders = getHeaders(event);
          appSpy(requestHeaders);
          return {};
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        baseURL,
      });

      client.updateBaseConfig({
        accessToken: "UPDATED_TOKEN",
      });

      await client.invoke("readCart get /checkout/cart");

      expect(appSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          "sw-access-key": "UPDATED_TOKEN",
        }),
      );

      expect(client.getBaseConfig()).toEqual({
        baseURL,
        accessToken: "UPDATED_TOKEN",
      });
    });

    it("should not recreate client when baseURL is the same", async () => {
      const appSpy = vi.fn().mockImplementation(() => {});
      const app = createApp().use(
        "/checkout/cart",
        eventHandler(async (event) => {
          const requestHeaders = getHeaders(event);
          appSpy(requestHeaders);
          return {};
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAPIClient<operations>({
        accessToken: "123",
        baseURL,
      });

      client.updateBaseConfig({
        baseURL,
        accessToken: "CHANGED_TOKEN",
      });

      await client.invoke("readCart get /checkout/cart");

      expect(appSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          "sw-access-key": "CHANGED_TOKEN",
        }),
      );
    });

    it("should not update accessToken when it is the same", () => {
      const client = createAPIClient<operations>({
        accessToken: "SAME_TOKEN",
        baseURL: "https://example.com",
      });

      client.updateBaseConfig({
        accessToken: "SAME_TOKEN",
      });

      expect(client.getBaseConfig()).toEqual({
        baseURL: "https://example.com",
        accessToken: "SAME_TOKEN",
      });
    });

    it("should return current base configuration", () => {
      const client = createAPIClient<operations>({
        accessToken: "INITIAL_TOKEN",
        baseURL: "https://initial-url.com",
      });

      expect(client.getBaseConfig()).toEqual({
        baseURL: "https://initial-url.com",
        accessToken: "INITIAL_TOKEN",
      });

      client.updateBaseConfig({
        baseURL: "https://new-url.com",
        accessToken: "NEW_TOKEN",
      });

      expect(client.getBaseConfig()).toEqual({
        baseURL: "https://new-url.com",
        accessToken: "NEW_TOKEN",
      });
    });
  });
});
