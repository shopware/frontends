// @vitest-environment happy-dom

import { createApp, eventHandler, getHeaders, toNodeListener } from "h3";
import type { App } from "h3";
import { listen } from "listhen";
import type { Listener } from "listhen";
import { afterAll, describe, expect, it, vi } from "vitest";

import type { operations } from "../api-types/storeApiTypes";
import { createAPIClient } from "./createAPIClient";

/**
 * The API client running in a browser. The whole file uses the `happy-dom`
 * environment (see the docblock above), so `window`, `FormData` and
 * `AbortController` are the browser implementations. Node behaviour is covered
 * in createApiClient.test.ts.
 *
 * Header handling itself is no longer environment-dependent - see
 * resolveRequestHeaders.ts - so the upload test here is a regression guard that
 * the browser gets the same result as the server.
 */
describe("createAPIClient (browser environment)", () => {
  const listeners: Listener[] = [];

  async function createPortAndGetUrl(appToCreate: App) {
    try {
      const listener = await listen(toNodeListener(appToCreate), {
        port: {
          portRange: [3700, 3799],
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

  it("should remove multipart/form-data Content-Type header in the browser", async () => {
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
    // A boundary-less multipart/form-data is dropped, so the browser can set the
    // header together with a generated boundary. With no body there is nothing
    // for it to type, so the request goes out without a Content-Type.
    expect(headers?.["content-type"]).toBeUndefined();
    // Verify multipart/form-data is not present in any header value.
    const headerValues = Object.values(headers || {}).join(" ");
    expect(headerValues).not.toContain("multipart/form-data");
  });

  it("should reject an aborted request with the browser-specific message", async () => {
    const app = createApp().use(
      "/context",
      eventHandler(async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
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
});
