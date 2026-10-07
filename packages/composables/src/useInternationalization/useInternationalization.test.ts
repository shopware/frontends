import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { useSetup } from "../_test";
import { useSessionContext } from "../useSessionContext/useSessionContext";
import { useInternationalization } from "./useInternationalization";
import type { RouteObject } from "./useInternationalization";

describe("useInternationalization", () => {
  it("should return storefrontUrl", async () => {
    const url = "http://frontend.test";
    vi.stubGlobal("location", {
      origin: url,
    });
    const { vm } = useSetup(useInternationalization);

    expect(vm.getStorefrontUrl()).toBe(url);

    vi.unstubAllGlobals();
  });

  it("should return default window storefrontUrl", async () => {
    const { vm } = useSetup(useInternationalization);

    expect(vm.getStorefrontUrl()).toBe("http://localhost:3000");
  });

  it("should invoke getting available languages", async () => {
    const { vm, injections } = useSetup(useInternationalization);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.getAvailableLanguages();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readLanguages post"),
    );
  });

  it("getAvailableLanguages uses the cacheable GET variant when cacheableReads is enabled", async () => {
    const { vm, injections } = useSetup(useInternationalization, {
      shopware: { cacheableReads: true },
    } as Parameters<typeof useSetup>[1]);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getAvailableLanguages();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      "readLanguagesGet get /language",
    );
  });

  it("should invoke change language", async () => {
    const { vm, injections } = useSetup(useInternationalization);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.changeLanguage("test-id");
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("updateContext"),
      expect.objectContaining({ body: { languageId: "test-id" } }),
    );
  });

  it("getLanguageCodeFromId", async () => {
    const { vm } = useSetup(useInternationalization);
    vm.languages = [
      { id: "test-id", translationCode: { code: "test-code" } },
    ] as Schemas["Language"][];
    expect(vm.getLanguageCodeFromId("test-id")).toBe("test-code");
  });

  it("getLanguageCodeFromId -  no translationCode", async () => {
    const { vm } = useSetup(useInternationalization);
    vm.languages = [{ id: "test-id" }] as Schemas["Language"][];
    expect(vm.getLanguageCodeFromId("test-id")).toBe("");
  });

  it("getLanguageCodeFromId - no languages", async () => {
    const { vm } = useSetup(useInternationalization);
    expect(() => vm.getLanguageCodeFromId("test-id")).toThrowError();
  });

  it("getLanguageIdFromCode", async () => {
    const { vm } = useSetup(useInternationalization);
    vm.languages = [
      { id: "test-id", translationCode: { code: "test-code" } },
    ] as Schemas["Language"][];
    expect(vm.getLanguageIdFromCode("test-code")).toBe("test-id");
  });

  it("getLanguageIdFromCode - no id", async () => {
    const { vm } = useSetup(useInternationalization);
    vm.languages = [
      { translationCode: { code: "test-code" } },
    ] as Schemas["Language"][];
    expect(vm.getLanguageIdFromCode("test-code")).toBe("");
  });

  it("getLanguageIdFromCode - no languages", async () => {
    const { vm } = useSetup(useInternationalization);
    expect(() => vm.getLanguageIdFromCode("test-code")).toThrowError();
  });

  it("should return the storefront url with the devStorefrontUrl", async () => {
    const url = "http://frontend.test";
    const { vm } = useSetup(useInternationalization);

    expect(vm.replaceToDevStorefront(url)).toBe(url);
  });

  it("formatLink", async () => {
    const { vm } = useSetup(() =>
      useInternationalization((element) => element),
    );
    expect(vm.formatLink("test")).toBe("test");
  });

  it("formatLink with path", async () => {
    const { vm } = useSetup(() =>
      useInternationalization((element) => element),
    );
    expect(vm.formatLink({ path: "test" })).toStrictEqual({ path: "test" });
  });

  it("formatLink custom structure", async () => {
    const { vm } = useSetup(() =>
      useInternationalization((element) => element),
    );
    expect(
      vm.formatLink({ custom: "test" } as unknown as RouteObject),
    ).toStrictEqual({
      custom: "test",
    });
  });

  it("replaceToDevStorefront with devStorefrontUrl", async () => {
    const { vm } = useSetup(
      () => useInternationalization((element) => element),
      {
        shopware: { devStorefrontUrl: "http://dev-storefront.test" },
      },
    );
    expect(vm.getStorefrontUrl()).toBe("http://dev-storefront.test");
    expect(vm.replaceToDevStorefront("http://localhost:3000/test")).toBe(
      "http://dev-storefront.test/test",
    );
  });

  it("uses a sales channel domain when the preferred storefront URL is not configured there", async () => {
    const { vm } = useSetup(
      () => {
        const session = useSessionContext();
        const i18n = useInternationalization();
        return {
          setContext: session.setContext,
          getStorefrontUrl: i18n.getStorefrontUrl,
        };
      },
      {
        shopware: {
          devStorefrontUrl: "https://frontends-starter-template.vercel.app",
        },
      },
    );

    vm.setContext({
      salesChannel: {
        domains: [
          {
            url: "https://demo-frontends.shopware.store/figma",
            languageId: "lang-en",
          },
        ],
        languageId: "lang-en",
      },
    } as Schemas["SalesChannelContext"]);

    expect(vm.getStorefrontUrl()).toBe(
      "https://demo-frontends.shopware.store/figma",
    );
  });

  it("keeps the preferred storefront URL when it matches a sales channel domain", async () => {
    const preferred = "https://frontends-starter-template.vercel.app";
    const { vm } = useSetup(
      () => {
        const session = useSessionContext();
        const i18n = useInternationalization();
        return {
          setContext: session.setContext,
          getStorefrontUrl: i18n.getStorefrontUrl,
        };
      },
      {
        shopware: { devStorefrontUrl: preferred },
      },
    );

    vm.setContext({
      salesChannel: {
        domains: [{ url: preferred, languageId: "lang-en" }],
        languageId: "lang-en",
      },
    } as Schemas["SalesChannelContext"]);

    expect(vm.getStorefrontUrl()).toBe(preferred);
  });

  it("falls back to the first sales channel domain when no language domain matches", async () => {
    const { vm } = useSetup(
      () => {
        const session = useSessionContext();
        const i18n = useInternationalization();
        return {
          setContext: session.setContext,
          getStorefrontUrl: i18n.getStorefrontUrl,
        };
      },
      {
        shopware: { devStorefrontUrl: "https://not-a-channel-domain.example" },
      },
    );

    vm.setContext({
      salesChannel: {
        domains: [
          { url: undefined, languageId: "lang-de" },
          {
            url: "https://demo-frontends.shopware.store/figma",
            languageId: "lang-en",
          },
        ],
        languageId: "lang-pl",
      },
      context: { languageIdChain: ["lang-fr"] },
    } as Schemas["SalesChannelContext"]);

    expect(vm.getStorefrontUrl()).toBe(
      "https://demo-frontends.shopware.store/figma",
    );
  });

  it("keeps the preferred URL when sales channel domains have no url", async () => {
    const preferred = "https://frontends-starter-template.vercel.app";
    const { vm } = useSetup(
      () => {
        const session = useSessionContext();
        const i18n = useInternationalization();
        return {
          setContext: session.setContext,
          getStorefrontUrl: i18n.getStorefrontUrl,
        };
      },
      {
        shopware: { devStorefrontUrl: preferred },
      },
    );

    vm.setContext({
      salesChannel: {
        domains: [{ languageId: "lang-en" }],
        languageId: "lang-de",
      },
    } as Schemas["SalesChannelContext"]);

    expect(vm.getStorefrontUrl()).toBe(preferred);
  });

  it("treats a trailing slash as the same sales channel domain", async () => {
    const { vm } = useSetup(
      () => {
        const session = useSessionContext();
        const i18n = useInternationalization();
        return {
          setContext: session.setContext,
          getStorefrontUrl: i18n.getStorefrontUrl,
        };
      },
      {
        shopware: {
          devStorefrontUrl: "https://frontends-starter-template.vercel.app/",
        },
      },
    );

    vm.setContext({
      salesChannel: {
        domains: [
          {
            url: "https://frontends-starter-template.vercel.app",
            languageId: "lang-en",
          },
        ],
      },
    } as Schemas["SalesChannelContext"]);

    expect(vm.getStorefrontUrl()).toBe(
      "https://frontends-starter-template.vercel.app",
    );
  });

  it("getStorefrontUrl without devStorefrontUrl and window", async () => {
    vi.spyOn(window, "location", "get").mockImplementation(
      () => ({}) as Location,
    );
    const { vm } = useSetup(
      () => useInternationalization((element) => element),
      {
        shopware: { devStorefrontUrl: null },
      },
    );

    expect(vm.getStorefrontUrl()).toBe("");
  });

  it("pathResolver absolute path", async () => {
    const { vm } = useSetup(() =>
      useInternationalization((element) => element),
    );
    expect(vm.formatLink("http://www.test.test")).toBe("http://www.test.test");
  });

  it("pathResolver without resolver", async () => {
    const { vm } = useSetup(() => useInternationalization());
    expect(vm.formatLink("test")).toBe("test");
  });
});
