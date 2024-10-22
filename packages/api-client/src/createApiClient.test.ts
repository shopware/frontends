import { afterAll, describe, expect, it, vi } from "vitest";
import { listen } from "listhen";
import type { Listener } from "listhen";
import {
  createApp,
  createError,
  eventHandler,
  toNodeListener,
  setHeader,
  getHeaders,
} from "h3";
import type { App } from "h3";
import { createAPIClient } from "./createAPIClient";
import type { operations } from "../api-types/storeApiTypes";

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
      baseURL,
    });
    await client.invoke("readCart get /checkout/cart");
    expect(seoUrlHeadersSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-context-token": "",
      }),
    );
  });

  it("should invoke requests with sw-context-token header", async () => {
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

  it("should remove multipart/form-data headers in case of browser", async () => {
    // @vitest-environment jsdom

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

    await client.invoke("fileUpload post /core/upload" as any, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    expect(contentTypeSpy).toHaveBeenCalledWith(
      expect.not.objectContaining({
        "content-type": "multipart/form-data",
      }),
    );
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
      `[ApiClientError: Failed request]`,
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

    expect(request).rejects.toThrowErrorMatchingInlineSnapshot(
      `[FetchError: [GET] "${baseURL}context": <no response> The operation was aborted.]`,
    );
  });
});
