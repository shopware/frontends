import Cookies from "js-cookie";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { PublicShopwareConfig } from "@/platform/shopware/publicConfig";

import { READ_TIMEOUT_MS } from "./readTimeout";

type ContextChanged = (contextToken: string) => void;

const api = vi.hoisted(() => ({
  options: [] as Record<string, unknown>[],
  hooks: new Map<string, ContextChanged>(),
}));

vi.mock("@shopware/api-client", () => ({
  createAPIClient: (options: Record<string, unknown>) => {
    api.options.push(options);
    return {
      invoke: vi.fn(),
      hook: (name: string, callback: ContextChanged) => {
        api.hooks.set(name, callback);
      },
    };
  },
}));

const config: PublicShopwareConfig = {
  endpoint: "https://shop.test/store-api/",
  accessToken: "SWSCTEST",
  devStorefrontUrl: null,
};

const happyDOM = (
  window as unknown as { happyDOM: { setURL(url: string): void } }
).happyDOM;

async function loadModule() {
  vi.resetModules();
  return import("./browserClient");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function contextChanged(): ContextChanged {
  const callback = api.hooks.get("onContextChanged");
  if (!callback) throw new Error("onContextChanged is not hooked");
  return callback;
}

beforeAll(async () => {
  await import("./browserClient");
});

beforeEach(() => {
  api.options.length = 0;
  api.hooks.clear();
  happyDOM.setURL("http://localhost:3000/");
});

afterEach(() => {
  Cookies.remove("sw-context-token", { path: "/" });
  vi.restoreAllMocks();
});

describe("createBrowserClient", () => {
  it("creates a Store API client for the public endpoint", async () => {
    const { createBrowserClient } = await loadModule();

    createBrowserClient(config);

    expect(api.options).toEqual([
      {
        baseURL: "https://shop.test/store-api/",
        accessToken: "SWSCTEST",
        contextToken: undefined,
      },
    ]);
  });

  it("continues the session of an existing sw-context-token cookie", async () => {
    Cookies.set("sw-context-token", "existing-token", { path: "/" });
    const { createBrowserClient } = await loadModule();

    createBrowserClient(config);

    expect(api.options[0]?.contextToken).toBe("existing-token");
  });

  it("writes every new context token to the cookie", async () => {
    const { createBrowserClient, CONTEXT_TOKEN_COOKIE } = await loadModule();
    createBrowserClient(config);

    contextChanged()("new-token");

    expect(CONTEXT_TOKEN_COOKIE).toBe("sw-context-token");
    expect(document.cookie).toContain("sw-context-token=new-token");

    contextChanged()("next-token");

    expect(document.cookie).toContain("sw-context-token=next-token");
    expect(document.cookie).not.toContain("new-token");
  });

  it("sets a year-long lax cookie for the whole site, not secure over http", async () => {
    const set = vi.spyOn(Cookies, "set");
    const { createBrowserClient } = await loadModule();
    createBrowserClient(config);

    contextChanged()("new-token");

    expect(set).toHaveBeenCalledWith("sw-context-token", "new-token", {
      expires: 365,
      path: "/",
      sameSite: "lax",
      secure: false,
    });
  });

  it("marks the cookie secure when the page is served over https", async () => {
    happyDOM.setURL("https://storefront.test/");
    const set = vi.spyOn(Cookies, "set");
    const { createBrowserClient } = await loadModule();
    createBrowserClient({ ...config, endpoint: "http://shop.test/store-api/" });

    contextChanged()("new-token");

    expect(set).toHaveBeenCalledWith(
      "sw-context-token",
      "new-token",
      expect.objectContaining({ secure: true }),
    );
  });
});

describe("loadPublicConfig", () => {
  it("fetches the config route once per page load", async () => {
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi.fn(async () => jsonResponse(config));

    const first = await loadPublicConfig(fetchImpl);
    const second = await loadPublicConfig(fetchImpl);

    expect(first).toEqual(config);
    expect(second).toBe(first);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith("/api/shopware/config", {
      cache: "no-store",
      signal: expect.any(AbortSignal),
    });
  });

  it("gives up on the config route after the read timeout", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse(config));

    await loadPublicConfig(fetchImpl);

    expect(timeout).toHaveBeenCalledTimes(1);
    expect(timeout).toHaveBeenCalledWith(READ_TIMEOUT_MS);
    expect(fetchImpl.mock.calls[0]?.[1]?.signal).toBe(
      timeout.mock.results[0]?.value,
    );
  });

  it("shares one request between concurrent callers", async () => {
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi.fn(async () => jsonResponse(config));

    const [first, second] = await Promise.all([
      loadPublicConfig(fetchImpl),
      loadPublicConfig(fetchImpl),
    ]);

    expect(second).toBe(first);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries after a failed response instead of keeping the failure", async () => {
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ error: "down" }, 503))
      .mockResolvedValueOnce(jsonResponse(config));

    await expect(loadPublicConfig(fetchImpl)).rejects.toThrow("503");
    await expect(loadPublicConfig(fetchImpl)).resolves.toEqual(config);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("retries after a network error", async () => {
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(jsonResponse(config));

    await expect(loadPublicConfig(fetchImpl)).rejects.toThrow(
      "Failed to fetch",
    );
    await expect(loadPublicConfig(fetchImpl)).resolves.toEqual(config);
  });

  it("rejects a malformed payload and retries afterwards", async () => {
    const { loadPublicConfig } = await loadModule();
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({ endpoint: "" }))
      .mockResolvedValueOnce(jsonResponse(config));

    await expect(loadPublicConfig(fetchImpl)).rejects.toThrow();
    await expect(loadPublicConfig(fetchImpl)).resolves.toEqual(config);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
