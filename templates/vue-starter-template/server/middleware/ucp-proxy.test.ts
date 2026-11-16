import * as h3 from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as agenticHandoff from "../utils/agenticHandoff";

const HOST = "shop.example.com";
const config = {
  agenticHandoff: { shopwareOrigin: "", storefrontHosts: HOST },
  public: {
    agenticHandoff: { enabled: true },
    shopware: { endpoint: "https://api.example.com/shop/store-api" },
  },
};
const upstream = vi.fn();

for (const name of [
  "defineEventHandler",
  "getRequestProtocol",
  "getRequestHeader",
  "getProxyRequestHeaders",
  "getRequestIP",
  "readRawBody",
  "sendProxy",
  "getRequestHost",
] as const) {
  vi.stubGlobal(name, h3[name]);
}
for (const [name, helper] of Object.entries(agenticHandoff)) {
  vi.stubGlobal(name, helper);
}
vi.stubGlobal("useRuntimeConfig", () => config);
vi.stubGlobal("getShopwareServerConfig", () => ({
  endpoint: config.public.shopware.endpoint,
  accessToken: "key",
}));
vi.stubGlobal("fetch", upstream);

const { default: proxy } = await import("./ucp-proxy");
const handle = h3.toWebHandler(h3.createApp().use(proxy));

function send(path: string, init: RequestInit = {}) {
  return handle(
    new Request(`https://${HOST}${path}`, {
      ...init,
      headers: { host: HOST, "x-forwarded-proto": "https", ...init.headers },
    }),
  );
}

function forwarded() {
  const [url, init] = upstream.mock.calls[0] as [string, RequestInit];
  return { url, headers: init.headers as Record<string, string> };
}

beforeEach(() => {
  upstream.mockReset();
  upstream.mockResolvedValue(
    new Response('{"ok":true}', {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
  config.public.agenticHandoff.enabled = true;
});

describe("ucp-proxy", () => {
  it("proxies a UCP path to the Shopware origin, keeping its sub-path", async () => {
    const response = await send("/ucp/mcp?toolsets=other", {
      method: "POST",
      body: '{"jsonrpc":"2.0"}',
      headers: { accept: "application/json, text/event-stream" },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    const { url, headers } = forwarded();
    expect(url).toBe("https://api.example.com/shop/ucp/mcp?toolsets=other");
    expect(headers.accept).toBe("application/json, text/event-stream");
    expect(headers["x-forwarded-host"]).toBe(HOST);
    expect(headers["x-forwarded-proto"]).toBe("https");
    expect(headers["x-forwarded-port"]).toBe("443");
    expect(
      new TextDecoder().decode(upstream.mock.calls[0]?.[1]?.body as Uint8Array),
    ).toBe('{"jsonrpc":"2.0"}');
  });

  it("replaces the client's hop headers with its own", async () => {
    await send("/.well-known/ucp", {
      headers: {
        forwarded: "host=evil.test",
        "x-forwarded-for": "203.0.113.9",
        "x-forwarded-prefix": "/evil",
        "x-real-ip": "203.0.113.9",
        "sw-context-token": "agentsession0000000000000000001",
      },
    });

    const { headers } = forwarded();
    expect(headers.forwarded).toBeUndefined();
    expect(headers["x-forwarded-prefix"]).toBeUndefined();
    expect(headers["x-real-ip"]).toBeUndefined();
    expect(headers["x-forwarded-for"]).not.toBe("203.0.113.9");
    expect(headers["x-forwarded-host"]).toBe(HOST);
    expect(headers["sw-context-token"]).toBe("agentsession0000000000000000001");
  });

  it("does not proxy other paths", async () => {
    for (const path of ["/", "/ucp", "/ucpx/y", "/.well-known/ucpx"]) {
      const response = await send(path);

      expect(response.status, path).toBe(404);
    }
    expect(upstream).not.toHaveBeenCalled();
  });

  it("is off while the handoff is off", async () => {
    config.public.agenticHandoff.enabled = false;

    const response = await send("/.well-known/ucp");

    expect(response.status).toBe(404);
    expect(upstream).not.toHaveBeenCalled();
  });
});
