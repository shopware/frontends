import { createApp, eventHandler, readBody, toNodeListener } from "h3";
import type { App } from "h3";
import { listen } from "listhen";
import type { Listener } from "listhen";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { createAdminAPIClient } from ".";
import type { operations } from "../api-types/adminApiTypes";

describe("createAdminAPIClient - credentials", () => {
  const listeners: Listener[] = [];
  const consoleWarnSpy = vi.spyOn(console, "warn");
  const authEndpointSpy = vi.fn().mockImplementation(() => {});
  const orderEndpointSpy = vi.fn().mockImplementation(() => {});
  let baseURL: string;

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

  beforeAll(async () => {
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
          return {
            headers: event.node.req.headers,
          };
        }),
      );

    baseURL = await createPortAndGetUrl(app);
    consoleWarnSpy.mockImplementation(() => {});
  });

  afterAll(async () => {
    for (const listener of listeners) {
      await listener.close().catch(console.error);
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display warning before calling /oauth/token endpoint if neither credentials nor sessionData are passed", async () => {
    const client = createAdminAPIClient<operations>({
      baseURL,
    });
    await client.invoke("getOrderList get /order");

    expect(consoleWarnSpy).toHaveBeenLastCalledWith(
      "[ApiClientWarning] No `credentials` or `sessionData` provided. Provide at least one of them to ensure authentication.",
    );
    expect(authEndpointSpy).toHaveBeenCalledWith({
      client_id: "administration",
      grant_type: "refresh_token",
      refresh_token: "",
    });
  });

  it("should use credentials when no session data available and transform scopes to scope", async () => {
    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "password",
        username: "user",
        password: "password",
        client_id: "administration",
        scopes: "write",
      },
    });
    await client.invoke("getOrderList get /order");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    // `scopes` should be transformed to `scope` as expected by League OAuth2 server
    expect(authEndpointSpy).toHaveBeenCalledWith({
      grant_type: "password",
      username: "user",
      password: "password",
      client_id: "administration",
      scope: "write",
    });
  });

  it("should use token credentials when no session data available", async () => {
    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "client_credentials",
        client_id: "administration",
        client_secret: "secret",
      },
    });
    await client.invoke("getOrderList get /order");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(authEndpointSpy).toHaveBeenCalledWith({
      grant_type: "client_credentials",
      client_id: "administration",
      client_secret: "secret",
    });
  });

  it("should not use credentials when sessionData is available with refresh_token", async () => {
    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "password",
        username: "user",
        password: "password",
        client_id: "administration",
        scopes: "write",
      },
      sessionData: {
        refreshToken: "my-refresh-token",
        accessToken: "my-access-token",
        expirationTime: 0,
      },
    });
    await client.invoke("getOrderList get /order");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(authEndpointSpy).toHaveBeenCalledWith({
      grant_type: "refresh_token",
      client_id: "administration",
      refresh_token: "my-refresh-token",
    });
  });

  it("should use credentials when it's token-based authentication and session expired", async () => {
    const client = createAdminAPIClient<operations>({
      baseURL,
      credentials: {
        grant_type: "client_credentials",
        client_id: "administration",
        client_secret: "secret",
      },
      sessionData: {
        accessToken: "my-access-token",
        expirationTime: 0,
      },
    });
    await client.invoke("getOrderList get /order");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(authEndpointSpy).toHaveBeenCalledWith({
      grant_type: "client_credentials",
      client_id: "administration",
      client_secret: "secret",
    });
  });
});
