import { ApiClientError } from "@shopware/api-client";
import * as h3 from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CONTEXT_TOKEN_PATTERN } from "../../../../shared/utils/agenticHandoff";
import * as agenticHandoff from "../../../utils/agenticHandoff";

const TOKEN = "0123456789abcdef0123456789abcdef";
const HOST = "shop.example.com";
const SAME_ORIGIN = { host: HOST, "sec-fetch-site": "same-origin" };

const config = {
  agenticHandoff: { shopwareOrigin: "", storefrontHosts: HOST },
  public: {
    agenticHandoff: { enabled: true },
    shopware: { endpoint: "https://api.example.com/store-api" },
  },
};
const invoke = vi.fn();

for (const name of [
  "defineEventHandler",
  "createError",
  "getRequestHeaders",
  "getRouterParam",
  "sendRedirect",
  "setCookie",
  "getRequestHost",
  "getRequestProtocol",
] as const) {
  vi.stubGlobal(name, h3[name]);
}
for (const [name, helper] of Object.entries(agenticHandoff)) {
  vi.stubGlobal(name, helper);
}
vi.stubGlobal("CONTEXT_TOKEN_PATTERN", CONTEXT_TOKEN_PATTERN);
vi.stubGlobal("useRuntimeConfig", () => config);
vi.stubGlobal("createServerApiClient", () => ({ invoke }));

const { default: adopt } = await import("./[token].post");
const handle = h3.toWebHandler(
  h3
    .createApp()
    .use(h3.createRouter().post("/checkout/continue/:token", adopt)),
);

function post(token: string, headers: Record<string, string> = SAME_ORIGIN) {
  return handle(
    new Request(`https://${HOST}/checkout/continue/${token}`, {
      method: "POST",
      headers,
    }),
  );
}

function backend(session: { customer?: object; lineItems?: object[] }) {
  invoke.mockImplementation(async (operation: string) =>
    operation.startsWith("readContext")
      ? { data: { customer: session.customer ?? null } }
      : { data: { lineItems: session.lineItems ?? [] } },
  );
}

beforeEach(() => {
  invoke.mockReset();
  config.agenticHandoff.storefrontHosts = HOST;
  config.public.agenticHandoff.enabled = true;
  config.public.shopware.endpoint = "https://api.example.com/store-api";
});

describe("POST /checkout/continue/[token]", () => {
  it("does not exist while the handoff is off", async () => {
    config.public.agenticHandoff.enabled = false;

    const response = await post(TOKEN);

    expect(response.status).toBe(404);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("does not exist on a host outside the list", async () => {
    config.agenticHandoff.storefrontHosts = "other.example.com";

    const response = await post(TOKEN);

    expect(response.status).toBe(404);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("refuses a cross-site post", async () => {
    const response = await post(TOKEN, {
      host: HOST,
      "sec-fetch-site": "cross-site",
    });

    expect(response.status).toBe(403);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("refuses a foreign Origin when the browser sends no Sec-Fetch-Site", async () => {
    const response = await post(TOKEN, {
      host: HOST,
      "x-forwarded-proto": "https",
      origin: "https://evil.test",
    });

    expect(response.status).toBe(403);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("sends a malformed token to the cart page", async () => {
    const response = await post("not-a-token");

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "/checkout/cart?handoff=invalid",
    );
    expect(invoke).not.toHaveBeenCalled();
  });

  it("refuses a session that is signed in, without reading its cart", async () => {
    backend({ customer: { id: "c1" }, lineItems: [{}] });

    const response = await post(TOKEN);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "/checkout/cart?handoff=unavailable",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("refuses an empty cart", async () => {
    backend({ lineItems: [] });

    const response = await post(TOKEN);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "/checkout/cart?handoff=unavailable",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("reports a backend failure without logging the token", async () => {
    const failed = Object.assign(
      new Response(null, {
        status: 429,
        headers: { "sw-context-token": TOKEN },
      }),
      { _data: { errors: [{ title: "Too Many Requests" }] } },
    );
    invoke.mockRejectedValue(new ApiClientError(failed));
    const errorLog = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await post(TOKEN);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "/checkout/cart?handoff=error",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(errorLog).toHaveBeenCalledTimes(1);
    const logged = errorLog.mock.calls[0]?.map(String).join(" ") ?? "";
    expect(logged).toContain("429");
    expect(logged).not.toContain(TOKEN);
    errorLog.mockRestore();
  });

  it("adopts the token and continues to the checkout", async () => {
    backend({ lineItems: [{}] });

    const response = await post(TOKEN);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/checkout");
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(
      /^sw-context-token=0123456789abcdef0123456789abcdef;/,
    );
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=31536000");
    expect(cookie).toContain("Secure");
    expect(cookie).not.toContain("HttpOnly");
  });

  it("accepts a same-origin post that carries Origin instead of Sec-Fetch-Site", async () => {
    backend({ lineItems: [{}] });

    const response = await post(TOKEN, {
      host: HOST,
      "x-forwarded-proto": "https",
      origin: `https://${HOST}`,
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/checkout");
  });

  it("leaves Secure off the cookie for an http Store API", async () => {
    config.public.shopware.endpoint = "http://localhost:8000/store-api";
    backend({ lineItems: [{}] });

    const response = await post(TOKEN);

    expect(response.headers.get("set-cookie")).not.toContain("Secure");
  });
});
