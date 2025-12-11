import {
  createApp,
  createError,
  eventHandler,
  getHeaders,
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

  it("should remove multipart/form-data headers in case of browser", async () => {
    // @vitest-environment happy-dom

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

    // @ts-expect-error this endpoint does not exist
    await client.invoke("fileUpload post /core/upload", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    expect(contentTypeSpy).toHaveBeenCalledTimes(1);
    const headers = contentTypeSpy.mock.calls[0]?.[0];
    expect(headers).toBeDefined();
    expect(headers).toMatchObject({
      accept: "application/json",
      "sw-access-key": "123",
      "sw-context-token": "456",
    });
    // Content-Type header should be removed when multipart/form-data in browser
    expect(headers?.["content-type"]).toBeUndefined();
    // User-agent should exist (platform-specific, so just check presence)
    expect(headers?.["user-agent"]).toMatch(/HappyDOM/);
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
      `[FetchError: [GET] "${baseURL}context": <no response> signal is aborted without reason]`,
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
