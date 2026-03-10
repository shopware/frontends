import { beforeEach, describe, expect, it, vi } from "vitest";

const addPluginMock = vi.fn();
const addTypeTemplateMock = vi.fn();
const addCustomTabMock = vi.fn();
const useLoggerMock = vi.fn(() => ({
  info: vi.fn(),
  warn: vi.fn(),
}));
const createResolverMock = vi.fn(() => ({
  resolve: (path: string) => `/mocked-module-dir/${path}`,
}));
const defineNuxtModuleMock = vi.fn(
  (config: { setup: (...args: unknown[]) => void }) => config,
);

const existsSyncMock = vi.fn();

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

vi.mock("./utils", () => ({
  isConfigDeprecated: () => false,
}));

function createNuxtMock(rootDir: string) {
  return {
    options: {
      rootDir,
      runtimeConfig: {
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
  });

  it("should inject default shopware.d.ts when project has no custom types", async () => {
    existsSyncMock.mockReturnValue(false);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(addTypeTemplateMock).toHaveBeenCalledWith({
      filename: "shopware.d.ts",
      src: "/mocked-module-dir/../shopware.d.ts",
    });
  });

  it("should skip injecting shopware.d.ts when project has custom types", async () => {
    existsSyncMock.mockReturnValue(true);
    const setup = await getModuleSetup();

    await setup({}, createNuxtMock("/tmp/test-project"));

    expect(addTypeTemplateMock).not.toHaveBeenCalled();
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
});
