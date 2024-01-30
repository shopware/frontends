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
import { createAPIClient } from ".";
import type { operationPaths, operations } from "../api-types";

describe("createAPIClient", () => {
  const listeners: Listener[] = [];

  afterAll(async () => {
    for (const listener of listeners) {
      await listener.close().catch(console.error);
    }
  });

  it("should invoke requests with sw-access-key header and no context-token by default", async () => {
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        setHeader;
        return {
          headers: event.node.req.headers,
        };
      }),
    );

    const listener = await listen(toNodeListener(app));
    const baseURL = listener.url;
    listeners.push(listener);

    const client = createAPIClient<operations, operationPaths>({
      accessToken: "123",
      baseURL,
    });
    const res = await client.invoke("readCart get /checkout/cart");
    expect(res.headers["sw-access-key"]).toEqual("123");
    expect(res.headers["sw-context-token"]).toBeUndefined();
  });

  it("should invoke requests with sw-context-token header", async () => {
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async (event) => {
        return {
          headers: event.node.req.headers,
        };
      }),
    );

    const listener = await listen(toNodeListener(app));
    const baseURL = listener.url;
    listeners.push(listener);

    const client = createAPIClient<operations, operationPaths>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
    });
    const res = await client.invoke("readCart get /checkout/cart");
    expect(res.headers["sw-context-token"]).toEqual("456");
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

    const listener = await listen(toNodeListener(app));
    const baseURL = listener.url;
    listeners.push(listener);

    const contextChangedMock = vi
      .fn()
      .mockImplementation((param: string) => {});

    const client = createAPIClient<operations, operationPaths>({
      accessToken: "123",
      contextToken: "456",
      baseURL,
      onContextChanged: contextChangedMock,
    });

    await client.invoke("readCart get /checkout/cart");
    expect(contextChangedMock).not.toHaveBeenCalled();
    await client.invoke("readContext get /context");
    expect(contextChangedMock).toHaveBeenCalledWith("789");
  });

  it("should throw error when there is a problem with request", async () => {
    const app = createApp().use(
      "/checkout/cart",
      eventHandler(async () => {
        throw createError({
          status: 500,
        });
      }),
    );

    const listener = await listen(toNodeListener(app));
    const baseURL = listener.url;
    listeners.push(listener);

    const client = createAPIClient<operations, operationPaths>({
      accessToken: "123",
      baseURL,
    });

    await expect(() =>
      client.invoke("readCart get /checkout/cart"),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[ApiClientError: Failed request]",
    );
  });
});
