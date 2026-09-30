import {
  createApp,
  createError,
  eventHandler,
  getHeaders,
  readBody,
  toNodeListener,
} from "h3";
import type { App } from "h3";
import { listen } from "listhen";
import type { Listener } from "listhen";
import { afterAll, describe, expect, it, vi } from "vitest";

import { createAdminAPIClient } from ".";
import type { components, operations } from "../api-types/adminApiTypes";
import { isTimeoutError } from "./isTimeoutError";

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
        accessToken: "Bearer old-access-token",
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

    await expect(request).rejects.toThrowErrorMatchingInlineSnapshot(
      `[FetchError: [GET] "${baseURL}order": <no response> This operation was aborted]`,
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

  describe("fetchOptions", () => {
    it("should enforce the timeout for API requests when a timeout is provided", async () => {
      const app = createApp().use(
        "/order",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
        fetchOptions: {
          timeout: 50,
        },
        baseURL,
      });

      await expect(
        client.invoke("getOrderList get /order", {}),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[FetchError: [GET] "${baseURL}order": <no response> [TimeoutError]: The operation was aborted due to timeout]`,
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

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
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

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
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

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
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

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
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

    it("should abort through the client timeout when a per-request signal is set", async () => {
      const app = createApp().use(
        "/order",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const error = await client
        .invoke("getOrderList get /order", {
          fetchOptions: { signal: new AbortController().signal },
        })
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
    });

    it("should abort through a per-request timeout when a per-request signal is set", async () => {
      const app = createApp().use(
        "/order",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return { message: "This should never be returned" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
        baseURL,
      });

      const error = await client
        .invoke("getOrderList get /order", {
          fetchOptions: { signal: new AbortController().signal, timeout: 50 },
        })
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
    });

    function createStalledRefreshApp() {
      const app = createApp();
      app.use(
        "/oauth/token",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return {
            access_token: "late-token",
            refresh_token: "late-refresh",
            expires_in: 3600,
          };
        }),
      );
      app.use(
        "/order",
        eventHandler(() => ({ message: "This should never be returned" })),
      );
      return app;
    }

    const expiredSession = {
      accessToken: "Bearer expired-token",
      refreshToken: "my-refresh-token",
      expirationTime: Date.now() - 1000,
    };

    it("should abort a stalled token refresh through the client timeout", async () => {
      const baseURL = await createPortAndGetUrl(createStalledRefreshApp());

      const client = createAdminAPIClient<operations>({
        sessionData: { ...expiredSession },
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const error = await client
        .invoke("getOrderList get /order", {})
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
    });

    it("should abort a stalled token refresh through the merged signal and timeout", async () => {
      const baseURL = await createPortAndGetUrl(createStalledRefreshApp());

      const client = createAdminAPIClient<operations>({
        sessionData: { ...expiredSession },
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const error = await client
        .invoke("getOrderList get /order", {
          fetchOptions: { signal: new AbortController().signal },
        })
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
    });

    it.each([
      { level: "client", clientTimeout: 50.5, requestTimeout: undefined },
      { level: "per-request", clientTimeout: undefined, requestTimeout: 0.5 },
    ])(
      "should round a fractional $level timeout up when combining it with a signal",
      async ({ clientTimeout, requestTimeout }) => {
        const app = createApp().use(
          "/order",
          eventHandler(async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return { message: "This should never be returned" };
          }),
        );

        const baseURL = await createPortAndGetUrl(app);

        const client = createAdminAPIClient<operations>({
          sessionData: {
            accessToken: "Bearer my-access-token",
            refreshToken: "my-refresh-token",
            expirationTime: Date.now() + 1000 * 60,
          },
          fetchOptions: { timeout: clientTimeout },
          baseURL,
        });

        const error = await client
          .invoke("getOrderList get /order", {
            fetchOptions: {
              signal: new AbortController().signal,
              timeout: requestTimeout,
            },
          })
          .catch((caught: unknown) => caught);

        expect(isTimeoutError(error)).toBe(true);
      },
    );

    function createSlowRefreshApp() {
      const app = createApp();
      app.use(
        "/oauth/token",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return {
            access_token: "fresh-token",
            refresh_token: "fresh-refresh",
            expires_in: 3600,
          };
        }),
      );
      app.use(
        "/order",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return { message: "Request succeeded" };
        }),
      );
      return app;
    }

    it("gives the token refresh a budget of its own when no signal is passed", async () => {
      const baseURL = await createPortAndGetUrl(createSlowRefreshApp());

      const client = createAdminAPIClient<operations>({
        sessionData: { ...expiredSession },
        fetchOptions: { timeout: 300 },
        baseURL,
      });

      const authChanged = vi.fn();
      client.hook("onAuthChange", authChanged);

      const startedAt = Date.now();
      const response = await client.invoke("getOrderList get /order", {});
      const elapsed = Date.now() - startedAt;

      // the refresh ran and the request still succeeded after longer than the
      // configured timeout, so each fetch was given the full budget
      expect(authChanged).toHaveBeenCalledTimes(1);
      expect(elapsed).toBeGreaterThan(300);
      expect(response).toEqual({
        data: { message: "Request succeeded" },
        status: 200,
      });
    });

    it("aborts a stalled token refresh in flight rather than letting it finish", async () => {
      const baseURL = await createPortAndGetUrl(createStalledRefreshApp());

      const client = createAdminAPIClient<operations>({
        sessionData: { ...expiredSession },
        fetchOptions: { timeout: 50 },
        baseURL,
      });

      const authChanged = vi.fn();
      client.hook("onAuthChange", authChanged);

      const error = await client
        .invoke("getOrderList get /order", {
          fetchOptions: { signal: new AbortController().signal },
        })
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
      expect(authChanged).not.toHaveBeenCalled();
      expect(client.getSessionData().accessToken).toBe("Bearer expired-token");
    });

    it("releases the timeout timer after the request settles", async () => {
      const app = createApp().use(
        "/order",
        eventHandler(async () => {
          await new Promise((resolve) => setTimeout(resolve, 20));
          return { message: "Request succeeded" };
        }),
      );

      const baseURL = await createPortAndGetUrl(app);

      const client = createAdminAPIClient<operations>({
        sessionData: {
          accessToken: "Bearer my-access-token",
          refreshToken: "my-refresh-token",
          expirationTime: Date.now() + 1000 * 60,
        },
        baseURL,
      });

      const armTimer = vi.spyOn(globalThis, "setTimeout");
      const releaseTimer = vi.spyOn(globalThis, "clearTimeout");
      try {
        await client.invoke("getOrderList get /order", {
          fetchOptions: {
            signal: new AbortController().signal,
            timeout: 12345,
          },
        });

        const armed = armTimer.mock.calls
          .map((call, index) =>
            call[1] === 12345 ? armTimer.mock.results[index]?.value : undefined,
          )
          .filter((timer) => timer !== undefined);

        expect(armed).toHaveLength(1);
        expect(
          releaseTimer.mock.calls.some(([released]) => released === armed[0]),
        ).toBe(true);
      } finally {
        armTimer.mockRestore();
        releaseTimer.mockRestore();
      }
    });

    it("spans the token refresh and the request with one deadline when a signal is passed", async () => {
      const baseURL = await createPortAndGetUrl(createSlowRefreshApp());

      const client = createAdminAPIClient<operations>({
        sessionData: { ...expiredSession },
        fetchOptions: { timeout: 300 },
        baseURL,
      });

      const error = await client
        .invoke("getOrderList get /order", {
          fetchOptions: { signal: new AbortController().signal },
        })
        .catch((caught: unknown) => caught);

      expect(isTimeoutError(error)).toBe(true);
    });
  });

  it("should let the runtime set multipart/form-data with a boundary for FormData uploads", async () => {
    const contentTypeSpy = vi.fn().mockImplementation(() => {});
    const app = createApp().use(
      "/_action/media/upload",
      eventHandler(async (event) => {
        contentTypeSpy(getHeaders(event));
        return { id: "media-id" };
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

    const formData = new FormData();
    formData.append("file", new Blob(["file-content"]), "file.txt");

    await client.invoke("uploadV2 post /_action/media/upload", {
      // contentType/accept are type-level metadata for this operation and are
      // ignored at runtime; the request Content-Type is derived from the body
      contentType: "multipart/form-data",
      accept: "application/json",
      // the typed body is a plain object; at runtime a FormData is required
      body: formData as unknown as { file: Blob },
    });

    expect(contentTypeSpy).toHaveBeenCalledTimes(1);
    const headers = contentTypeSpy.mock.calls[0]?.[0];
    // The default application/json must be removed so the runtime can set
    // multipart/form-data with a boundary.
    expect(headers?.["content-type"]).toMatch(
      /^multipart\/form-data; boundary=/,
    );
  });

  it("should keep sending the token refresh as JSON when the original request is an upload", async () => {
    // The /oauth/token request uses defaultHeaders directly and skips
    // resolveRequestHeaders. Its body is always a plain object, so it must stay
    // application/json even when the request that triggered the refresh is a
    // FormData upload.
    const tokenContentTypeSpy = vi.fn().mockImplementation(() => {});
    const uploadContentTypeSpy = vi.fn().mockImplementation(() => {});
    const app = createApp()
      .use(
        "/_action/media/upload",
        eventHandler(async (event) => {
          uploadContentTypeSpy(getHeaders(event)["content-type"]);
          return { id: "media-id" };
        }),
      )
      .use(
        "/oauth/token",
        eventHandler(async (event) => {
          tokenContentTypeSpy(getHeaders(event)["content-type"]);
          return {
            access_token: "refreshed-access-token",
            expires_in: 3600,
          };
        }),
      );

    const baseURL = await createPortAndGetUrl(app);

    const client = createAdminAPIClient<operations>({
      baseURL,
      sessionData: {
        accessToken: "Bearer expired-access-token",
        refreshToken: "my-refresh-token",
        expirationTime: 0,
      },
    });

    const formData = new FormData();
    formData.append("file", new Blob(["file-content"]), "file.txt");

    await client.invoke("uploadV2 post /_action/media/upload", {
      contentType: "multipart/form-data",
      accept: "application/json",
      body: formData as unknown as { file: Blob },
    });

    expect(tokenContentTypeSpy).toHaveBeenCalledWith("application/json");
    expect(uploadContentTypeSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^multipart\/form-data; boundary=/),
    );
  });
});
