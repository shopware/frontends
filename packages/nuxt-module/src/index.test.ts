import { beforeEach, describe, expect, it, vi } from "vitest";

const addPluginMock = vi.fn();
const addTypeTemplateMock = vi.fn();
const addCustomTabMock = vi.fn();
const loggerMock = {
  info: vi.fn(),
  warn: vi.fn(),
};
const useLoggerMock = vi.fn(() => loggerMock);
const createResolverMock = vi.fn(() => ({
  resolve: (path: string) => `/mocked-module-dir/${path}`,
}));
const defineNuxtModuleMock = vi.fn(
  (config: { setup: (...args: unknown[]) => void }) => config,
);

const existsSyncMock = vi.fn();

const isConfigDeprecatedMock = vi.fn(() => false);

vi.mock("node:fs", () => ({
  existsSync: existsSyncMock,
}));

vi.mock("@nuxt/kit", () => ({
  addPlugin: addPluginMock,
  addTypeTemplate: addTypeTemplateMock,
  createResolver: createResolverMock,
  defineNuxtModule: defineNuxtModuleMock,
  useLogger: useLoggerMock,
}));

vi.mock("@nuxt/devtools-kit", () => ({
  addCustomTab: addCustomTabMock,
}));

vi.mock("defu", () => ({
  defu: (...args: unknown[]) => Object.assign({}, ...args),
}));

vi.mock("./utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./utils")>()),
  isConfigDeprecated: isConfigDeprecatedMock,
}));

function createNuxtMock(rootDir: string) {
  return {
    options: {
      rootDir,
      runtimeConfig: {
        shopware: {},
        public: {
          shopware: {
            endpoint: "https://test.shopware.store/store-api/",
            accessToken: "test-token",
          },
        },
      },
    },
  };
}

async function getModuleSetup() {
  const mod = await import("./index");
  return (
    mod.default as unknown as {
      setup: (options: Record<string, unknown>, nuxt: unknown) => Promise<void>;
    }
  ).setup;
}

describe("@shopware/nuxt-module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isConfigDeprecatedMock.mockReturnValue(false);
  });

  const ALL_TYPE_CONTEXTS = {
    nuxt: true,
    nitro: true,
    node: true,
    shared: true,
  };

  it("should inject default shopware.d.ts in all type contexts when project has no custom types", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(addTypeTemplateMock).toHaveBeenCalledWith(
      {
        filename: "shopware.d.ts",
        src: "/mocked-module-dir/../shopware.d.ts",
      },
      ALL_TYPE_CONTEXTS,
    );
  });

  it("should reference the project's own shopware.d.ts in all type contexts when it exists", async () => {
    existsSyncMock.mockReturnValue(true);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(addTypeTemplateMock).toHaveBeenCalledTimes(1);
    const [template, context] = addTypeTemplateMock.mock.calls[0] as [
      { filename: string; getContents: () => string },
      Record<string, boolean>,
    ];
    expect(template.filename).toBe("shopware.d.ts");
    expect(template.getContents()).toContain(
      '/// <reference path="/tmp/test-project/shopware.d.ts" />',
    );
    expect(context).toEqual(ALL_TYPE_CONTEXTS);
  });

  it("should check for shopware.d.ts in the project root directory", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/my/project"));

    expect(existsSyncMock).toHaveBeenCalledWith("/my/project/shopware.d.ts");
  });

  it("should always register the plugin", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(addPluginMock).toHaveBeenCalledWith({
      src: "/mocked-module-dir/../plugin.ts",
    });
  });

  it("should persist the resolved SSR endpoint into private runtime config", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();
    const nuxt = createNuxtMock("/tmp/test-project");

    await setup({}, nuxt);

    expect(nuxt.options.runtimeConfig.shopware).toMatchObject({
      endpoint: "https://test.shopware.store/store-api/",
    });
  });

  it("should preserve an explicit private SSR endpoint", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();
    const nuxt = createNuxtMock("/tmp/test-project");
    nuxt.options.runtimeConfig.shopware = {
      endpoint: "http://internal.shopware/store-api/",
    };

    await setup({}, nuxt);

    expect(nuxt.options.runtimeConfig.shopware).toMatchObject({
      endpoint: "http://internal.shopware/store-api/",
    });
  });

  it("should warn when deprecated config keys are used", async () => {
    existsSyncMock.mockReturnValue(false);
    isConfigDeprecatedMock.mockReturnValue(true);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(loggerMock.warn).toHaveBeenCalledWith(
      "You are using deprecated configuration (shopwareEndpoint or shopwareAccessToken). 'shopware' prefix is not needed anymore. Please update your _nuxt.config.ts_ ",
    );
  });

  it("warns when the deprecated shopware.apiClientConfig is set", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup(
      { apiClientConfig: { timeout: 5000 } },
      createNuxtMock("/tmp/test-project"),
    );

    expect(loggerMock.warn).toHaveBeenCalledWith(
      "shopware.apiClientConfig is deprecated and will be removed in the next major. Move timeout to runtimeConfig.apiClientConfig or runtimeConfig.public.apiClientConfig.",
    );
  });

  it("does not warn about an apiClientConfig that sets no timeout", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({ apiClientConfig: {} }, createNuxtMock("/tmp/test-project"));

    expect(loggerMock.warn).not.toHaveBeenCalledWith(
      expect.stringContaining("apiClientConfig"),
    );
  });

  it("does not warn about shopware.apiClientConfig when it is unset", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(loggerMock.warn).not.toHaveBeenCalledWith(
      expect.stringContaining("apiClientConfig"),
    );
  });

  describe("secret-like keys", () => {
    const SECRET = "super-secret-value-123";

    it("strips top-level and nested secrets from public runtime config", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();
      const nuxt = createNuxtMock("/tmp/test-project");

      await setup(
        {
          clientId: "SWIA-ID",
          clientSecret: SECRET,
          credentials: { client_id: "SWIA-ID", client_secret: SECRET },
        },
        nuxt,
      );

      const publicConfig = nuxt.options.runtimeConfig.public.shopware;
      expect(publicConfig).not.toHaveProperty("clientId");
      expect(publicConfig).not.toHaveProperty("clientSecret");
      expect(publicConfig).toHaveProperty("credentials", {});
      expect(JSON.stringify(publicConfig)).not.toContain(SECRET);
    });

    it("strips secrets set directly in runtimeConfig.public.shopware", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();
      const nuxt = createNuxtMock("/tmp/test-project");
      Object.assign(nuxt.options.runtimeConfig.public.shopware, {
        adminApiSecret: SECRET,
      });

      await setup({}, nuxt);

      expect(nuxt.options.runtimeConfig.public.shopware).not.toHaveProperty(
        "adminApiSecret",
      );
    });

    it("keeps secrets from module options in private runtime config", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();
      const nuxt = createNuxtMock("/tmp/test-project");

      await setup(
        { clientSecret: SECRET, credentials: { client_secret: SECRET } },
        nuxt,
      );

      expect(nuxt.options.runtimeConfig.shopware).toMatchObject({
        clientSecret: SECRET,
        credentials: { client_secret: SECRET },
      });
    });

    it("keeps accessToken, endpoint and devStorefrontUrl public", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();
      const nuxt = createNuxtMock("/tmp/test-project");

      await setup(
        {
          clientSecret: SECRET,
          devStorefrontUrl: "http://localhost:3000",
        },
        nuxt,
      );

      expect(nuxt.options.runtimeConfig.public.shopware).toEqual({
        endpoint: "https://test.shopware.store/store-api/",
        accessToken: "test-token",
        devStorefrontUrl: "http://localhost:3000",
      });
    });

    it("warns once per stripped key with its path but never its value", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();

      await setup(
        { clientSecret: SECRET, credentials: { client_secret: SECRET } },
        createNuxtMock("/tmp/test-project"),
      );

      const secretWarnings = loggerMock.warn.mock.calls
        .map(([message]) => String(message))
        .filter((message) => message.includes("public runtime config"));
      expect(secretWarnings).toHaveLength(2);
      expect(secretWarnings[0]).toContain('"shopware.clientSecret"');
      expect(secretWarnings[1]).toContain(
        '"shopware.credentials.client_secret"',
      );
      for (const message of secretWarnings) {
        expect(message).toContain("NUXT_");
        expect(message).toContain("server/");
        expect(message).not.toContain(SECRET);
      }
    });

    it("does not warn when there are no secrets", async () => {
      existsSyncMock.mockReturnValue(false);
      const setup = await getModuleSetup();

      await setup({}, createNuxtMock("/tmp/test-project"));

      expect(loggerMock.warn).not.toHaveBeenCalled();
    });
  });
});
