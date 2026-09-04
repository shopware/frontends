import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createAPIClientMock = vi.fn((_params: Record<string, unknown>) => ({
  hook: vi.fn(),
}));
const isMaintenanceModeMock = vi.fn(() => false);
const getCookieMock = vi.fn(() => "ssr-context-token");
const cookiesMock = {
  get: vi.fn(() => "csr-context-token"),
  set: vi.fn(),
};
const createShopwareContextMock = vi.fn();
const showErrorMock = vi.fn();
const useRequestHeadersMock = vi.fn(() => ({}) as Record<string, string>);
const useStateMock = vi.fn();
const useRuntimeConfigMock = vi.fn();

vi.mock("@shopware/api-client", () => ({
  createAPIClient: createAPIClientMock,
}));

vi.mock("@shopware/helpers", () => ({
  isMaintenanceMode: isMaintenanceModeMock,
}));

vi.mock("h3", () => ({
  getCookie: getCookieMock,
}));

vi.mock("js-cookie", () => ({
  default: cookiesMock,
}));

vi.mock("#imports", () => ({
  createShopwareContext: createShopwareContextMock,
  defineNuxtPlugin: (setup: unknown) => setup,
  showError: showErrorMock,
  useRequestHeaders: useRequestHeadersMock,
  useRuntimeConfig: useRuntimeConfigMock,
  useState: useStateMock,
}));

type NuxtAppMock = {
  ssrContext?: { event: Record<string, unknown> };
  vueApp: { provide: ReturnType<typeof vi.fn> };
};

function createNuxtAppMock(withSsrContext: boolean): NuxtAppMock {
  return {
    ...(withSsrContext ? { ssrContext: { event: {} } } : {}),
    vueApp: { provide: vi.fn() },
  };
}

async function runPlugin(nuxtApp: NuxtAppMock) {
  const plugin = (await import("./plugin")).default as unknown as (
    app: NuxtAppMock,
  ) => unknown;
  return plugin(nuxtApp);
}

function runOnClient() {
  vi.stubGlobal("__NUXT_IMPORT_META_SERVER__", false);
  vi.stubGlobal("__NUXT_IMPORT_META_CLIENT__", true);
  vi.stubGlobal("navigator", { language: "de-DE" });
}

const SHOPWARE_CONFIG = {
  endpoint: "https://test.shopware.store/store-api/",
  accessToken: "test-token",
};

describe("nuxt-module plugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    createAPIClientMock.mockReturnValue({ hook: vi.fn() });
    vi.stubGlobal("__NUXT_IMPORT_META_SERVER__", true);
    vi.stubGlobal("__NUXT_IMPORT_META_CLIENT__", false);
    useRuntimeConfigMock.mockReturnValue({
      shopware: { ...SHOPWARE_CONFIG },
      public: { shopware: { ...SHOPWARE_CONFIG } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes the private timeout to createAPIClient on the server", async () => {
    useRuntimeConfigMock.mockReturnValue({
      shopware: { ...SHOPWARE_CONFIG },
      apiClientConfig: { timeout: 5000 },
      public: { shopware: { ...SHOPWARE_CONFIG } },
    });

    await runPlugin(createNuxtAppMock(true));

    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ fetchOptions: { timeout: 5000 } }),
    );
  });

  it("passes the public timeout to createAPIClient", async () => {
    useRuntimeConfigMock.mockReturnValue({
      shopware: { ...SHOPWARE_CONFIG },
      public: {
        shopware: { ...SHOPWARE_CONFIG },
        apiClientConfig: { timeout: 10000 },
      },
    });

    await runPlugin(createNuxtAppMock(true));

    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ fetchOptions: { timeout: 10000 } }),
    );
  });

  it("prefers the private timeout over the public one on the server", async () => {
    useRuntimeConfigMock.mockReturnValue({
      shopware: { ...SHOPWARE_CONFIG },
      apiClientConfig: { timeout: 5000 },
      public: {
        shopware: { ...SHOPWARE_CONFIG },
        apiClientConfig: { timeout: 10000 },
      },
    });

    await runPlugin(createNuxtAppMock(true));

    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ fetchOptions: { timeout: 5000 } }),
    );
  });

  it("reads only the public timeout in the browser", async () => {
    runOnClient();
    useRuntimeConfigMock.mockReturnValue({
      shopware: { ...SHOPWARE_CONFIG },
      apiClientConfig: { timeout: 5000 },
      public: {
        shopware: { ...SHOPWARE_CONFIG },
        apiClientConfig: { timeout: 10000 },
      },
    });

    await runPlugin(createNuxtAppMock(false));

    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ fetchOptions: { timeout: 10000 } }),
    );
  });

  describe.each([
    {
      name: "runtimeConfig.apiClientConfig",
      build: (timeout: unknown) => ({
        shopware: { ...SHOPWARE_CONFIG },
        apiClientConfig: { timeout },
        public: { shopware: { ...SHOPWARE_CONFIG } },
      }),
    },
    {
      name: "runtimeConfig.public.apiClientConfig",
      build: (timeout: unknown) => ({
        shopware: { ...SHOPWARE_CONFIG },
        public: {
          shopware: { ...SHOPWARE_CONFIG },
          apiClientConfig: { timeout },
        },
      }),
    },
    {
      name: "shopware.apiClientConfig",
      build: (timeout: unknown) => ({
        shopware: { ...SHOPWARE_CONFIG, apiClientConfig: { timeout } },
        public: { shopware: { ...SHOPWARE_CONFIG } },
      }),
    },
    {
      name: "public shopware.apiClientConfig",
      build: (timeout: unknown) => ({
        shopware: { ...SHOPWARE_CONFIG },
        public: {
          shopware: { ...SHOPWARE_CONFIG, apiClientConfig: { timeout } },
        },
      }),
    },
  ])("$name as the only source", ({ build }) => {
    it("forwards a positive number", async () => {
      useRuntimeConfigMock.mockReturnValue(build(5000));

      await runPlugin(createNuxtAppMock(true));

      expect(createAPIClientMock).toHaveBeenCalledWith(
        expect.objectContaining({ fetchOptions: { timeout: 5000 } }),
      );
    });

    it.each([
      0,
      -1,
      "5000",
      "abc",
      null,
      true,
      false,
      ["5"],
      {},
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ])("treats %p as unset", async (timeout) => {
      useRuntimeConfigMock.mockReturnValue(build(timeout));

      await runPlugin(createNuxtAppMock(true));

      expect(createAPIClientMock.mock.calls[0]?.[0]).not.toHaveProperty(
        "fetchOptions",
      );
    });
  });

  it("reaches createAPIClient with the endpoint and access token", async () => {
    await runPlugin(createNuxtAppMock(true));

    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://test.shopware.store/store-api/",
        accessToken: "test-token",
      }),
    );
  });

  it("takes the browser branch when import.meta.server is false", async () => {
    runOnClient();
    useRuntimeConfigMock.mockReturnValue({
      shopware: { endpoint: "https://private.internal/store-api/" },
      public: { shopware: { ...SHOPWARE_CONFIG } },
    });

    await runPlugin(createNuxtAppMock(false));

    expect(cookiesMock.get).toHaveBeenCalledWith("sw-context-token");
    expect(getCookieMock).not.toHaveBeenCalled();
    expect(createAPIClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://test.shopware.store/store-api/",
      }),
    );
  });
});
