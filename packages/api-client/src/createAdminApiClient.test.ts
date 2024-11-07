import { afterAll, describe, expect, it, vi } from "vitest";
import { listen } from "listhen";
import type { Listener } from "listhen";
import {
  createApp,
  createError,
  eventHandler,
  toNodeListener,
  getHeaders,
  readBody,
} from "h3";
import type { App } from "h3";
import { createAdminAPIClient } from ".";
import type { components, operations } from "../api-types/adminApiTypes";

describe("createAdminAPIClient", () => {
  const listeners: Listener[] = [];

  async function createPortAndGetUrl(appToCreate: App) {
    try {
      const listener = await listen(toNodeListener(appToCreate), {
        port: {
          portRange: [3500, 3599],
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

  it("should invoke /oauth/token request before any request if there's no session data", async () => {
    const authEndpointSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/order",
        eventHandler(async () => {
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          const body = await readBody(event);
          authEndpointSpy(body);
          return {
            headers: event.node.req.headers,
          };
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "",
        refreshToken: "my-refresh-token",
        expirationTime: 0,
      },
    });
    const res = await client.invoke("getOrderList get /order", {});
    expect(res.data).toEqual({ orderResponse: 123 });
    expect(authEndpointSpy).toHaveBeenCalledWith({
      client_id: "administration",
      grant_type: "refresh_token",
      refresh_token: "my-refresh-token",
    });
  });

  it("should invoke /oauth/token request to refresh access token when it has expired", async () => {
    const authEndpointSpy = vi.fn().mockImplementation(() => {});
    const authHeaderSpy = vi.fn().mockImplementation(() => {});
    const onAuthChangeSpy = vi.fn().mockImplementation(() => {});
    const defaultHeadersSpy = vi.fn();
    const app = createApp()
      .use(
        "/order",
        eventHandler(async (event) => {
          const headers = getHeaders(event);
          authHeaderSpy(headers.authorization);
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          const body = await readBody(event);
          authEndpointSpy(body);
          return {
            access_token: "client-session-access-token",
            expires_in: 3600,
          };
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "old-acees-token",
        refreshToken: "my-refresh-token",
        expirationTime: 0,
      },
    });
    client.hook("onAuthChange", onAuthChangeSpy);
    client.hook("onDefaultHeaderChanged", defaultHeadersSpy);
    const res = await client.invoke("getOrderList get /order", {});
    expect(authEndpointSpy).toHaveBeenCalledWith({
      client_id: "administration",
      grant_type: "refresh_token",
      refresh_token: "my-refresh-token",
    });
    expect(authHeaderSpy).toHaveBeenCalledWith(
      "Bearer client-session-access-token",
    );
    expect(res.data).toEqual({ orderResponse: 123 });

    expect(onAuthChangeSpy).toBeCalledWith({
      accessToken: "client-session-access-token",
      expirationTime: expect.any(Number),
      refreshToken: "",
    });
    expect(defaultHeadersSpy).toBeCalledWith(
      "Authorization",
      "Bearer client-session-access-token",
    );
  });

  it("should not invoke /oauth/token request before request if there's an active session", async () => {
    const authEndpointSpy = vi.fn().mockImplementation(() => {});
    const authHeaderSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/order",
        eventHandler(async (event) => {
          const headers = getHeaders(event);
          authHeaderSpy(headers.authorization);
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          const body = await readBody(event);
          authEndpointSpy(body);
          return {
            headers: event.node.req.headers,
          };
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });
    const res = await client.invoke("getOrderList get /order", {});
    expect(authHeaderSpy).toHaveBeenCalledWith("Bearer my-access-token");
    expect(res.data).toEqual({ orderResponse: 123 });
    expect(authEndpointSpy).not.toHaveBeenCalled();
  });

  it("should invoke /oauth/token request before client based authentication", async () => {
    const authEndpointSpy = vi.fn().mockImplementation(() => {});
    const authHeaderSpy = vi.fn().mockImplementation(() => {});
    const onAuthChangeSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/order",
        eventHandler(async (event) => {
          const headers = getHeaders(event);
          authHeaderSpy(headers.authorization);
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          const body = await readBody(event);
          authEndpointSpy(body);
          return {
            access_token: "client-session-access-token",
            expires_in: 3600,
          };
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "client_credentials",
        client_id: "my-client-id",
        client_secret: "my-client-secret-token",
      },
    });
    client.hook("onAuthChange", onAuthChangeSpy);
    const res = await client.invoke("getOrderList get /order", {});
    expect(authEndpointSpy).toHaveBeenCalledWith({
      client_id: "my-client-id",
      client_secret: "my-client-secret-token",
      grant_type: "client_credentials",
    });
    expect(authHeaderSpy).toHaveBeenCalledWith(
      "Bearer client-session-access-token",
    );
    expect(res.data).toEqual({ orderResponse: 123 });

    expect(onAuthChangeSpy).toBeCalledWith({
      accessToken: "client-session-access-token",
      expirationTime: expect.any(Number),
      refreshToken: "",
    });
  });

  it("should not invoke onAuthChange if token response data does not contain session data", async () => {
    const onAuthChangeSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/order",
        eventHandler(async () => {
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async () => {
          return null;
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "client_credentials",
        client_id: "my-client-id",
        client_secret: "my-client-secret-token",
      },
    });
    client.hook("onAuthChange", onAuthChangeSpy);
    const res = await client.invoke("getOrderList get /order", {});
    expect(res.data).toEqual({ orderResponse: 123 });

    expect(onAuthChangeSpy).not.toHaveBeenCalled();
  });

  it("should throw error if /oauth token request fails and not to call desired endpoint at all", async () => {
    const authEndpointSpy = vi.fn().mockImplementation(() => {});
    const orderEndpointSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/order",
        eventHandler(async () => {
          orderEndpointSpy();
          return {
            orderResponse: 123,
          };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          const body = await readBody(event);
          authEndpointSpy(body);
          throw createError({
            status: 401,
          });
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "",
        refreshToken: "my-refresh-token",
        expirationTime: 0,
      },
    });
    await expect(() =>
      client.invoke("getOrderList get /order", {}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[ApiClientError: Failed request]",
    );
    expect(authEndpointSpy).toHaveBeenCalledWith({
      client_id: "administration",
      grant_type: "refresh_token",
      refresh_token: "my-refresh-token",
    });
    expect(orderEndpointSpy).not.toHaveBeenCalled();
  });

  it("should throw error from the endpoint", async () => {
    const app = createApp().use(
      "/order",
      eventHandler(async () => {
        throw createError({
          status: 500,
        });
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });
    await expect(() =>
      client.invoke("getOrderList get /order", {}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      "[ApiClientError: Failed request]",
    );
  });

  it(`should by default include "Accept" header with "application/json" value`, async () => {
    const seoUrlheadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/order",
      eventHandler(async (event) => {
        const headers = getHeaders(event);
        seoUrlheadersSpy(headers);
        return {
          orderResponse: 123,
          headers,
        };
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });
    await client.invoke("getOrderList get /order");

    expect(seoUrlheadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: "application/json",
      }),
    );
  });

  it("should change default headers", async () => {
    const seoUrlheadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/order",
      eventHandler(async (event) => {
        const headers = getHeaders(event);
        seoUrlheadersSpy(headers);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });
    client.defaultHeaders.Accept = "application/xml";
    await client.invoke("getOrderList get /order", {});

    expect(seoUrlheadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        accept: "application/xml",
      }),
    );
  });

  it("should override the default headers by passing the headers when invoke", async () => {
    const seoUrlheadersSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/order",
      eventHandler(async (event) => {
        const headers = getHeaders(event);
        seoUrlheadersSpy(headers);
        return {};
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });

    client.defaultHeaders.apply({
      "sw-language-id": "1",
    });

    await client.invoke("createOrder post /order", {
      // @ts-expect-error this endpoint does not contain headers definition
      headers: {
        "sw-language-id": "2",
      },
      body: {} as components["schemas"]["Order"],
    });

    expect(seoUrlheadersSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        "sw-language-id": "2",
      }),
    );
  });

  it("should allow to abort request", async () => {
    const app = createApp().use(
      "/order",
      eventHandler(async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(createError({ status: 408 }));
          }, 1000 * 2);
        });
      }),
    );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer my-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: Date.now() + 1000 * 60,
      },
    });

    const controller = new AbortController();
    const request = client.invoke("getOrderList get /order", {
      fetchOptions: {
        signal: controller.signal,
      },
    });
    controller.abort();

    expect(request).rejects.toThrowErrorMatchingInlineSnapshot(
      `[FetchError: [GET] "${baseURL}order": <no response> The operation was aborted.]`,
    );
  });

  describe("onDefaultHeaderChanged hook", () => {
    it("should invoke hook on default header change", async () => {
      const defaultHeadersSpy = vi.fn();
      const client = createAdminAPIClient<operations>({
        baseURL: "http://localhost:3000",
      });
      client.hook("onDefaultHeaderChanged", defaultHeadersSpy);
      await client.defaultHeaders.apply({ accept: "application/xml" });
      expect(client.defaultHeaders.accept).toBe("application/xml");
      expect(defaultHeadersSpy).toBeCalledWith("accept", "application/xml");
    });

    it("should also invoke onAuthChange if the Authorization header is changed", async () => {
      const authEndpointSpy = vi.fn().mockImplementation(() => {});
      const authHeaderSpy = vi.fn().mockImplementation(() => {});
      const onAuthChangeSpy = vi.fn().mockImplementation(() => {});
      const defaultHeadersSpy = vi.fn();
      const app = createApp()
        .use(
          "/order",
          eventHandler(async (event) => {
            const headers = getHeaders(event);
            authHeaderSpy(headers.authorization);
            return {
              orderResponse: 123,
            };
          }),
        )
        .use(
          "/oauth/token",
          eventHandler(async (event) => {
            const body = await readBody(event);
            authEndpointSpy(body);
            return {
              access_token: "client-session-access-token",
              expires_in: 3600,
            };
          }),
        );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAdminAPIClient<operations>({
        baseURL,
        credentials: {
          grant_type: "client_credentials",
          client_id: "my-client-id",
          client_secret: "my-client-secret-token",
        },
      });
      client.hook("onAuthChange", onAuthChangeSpy);
      client.hook("onDefaultHeaderChanged", defaultHeadersSpy);
      const res = await client.invoke("getOrderList get /order", {});
      expect(authEndpointSpy).toHaveBeenCalledWith({
        client_id: "my-client-id",
        client_secret: "my-client-secret-token",
        grant_type: "client_credentials",
      });
      expect(authHeaderSpy).toHaveBeenCalledWith(
        "Bearer client-session-access-token",
      );
      expect(res.data).toEqual({ orderResponse: 123 });

      expect(onAuthChangeSpy).toBeCalledWith({
        accessToken: "client-session-access-token",
        expirationTime: expect.any(Number),
        refreshToken: "",
      });
      expect(defaultHeadersSpy).toBeCalledWith(
        "Authorization",
        "Bearer client-session-access-token",
      );
    });
  });
});
