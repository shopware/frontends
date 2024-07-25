import { describe, expect, it, vi } from "vitest";
import { useInternationalization } from "./useInternationalization";
import type { RouteObject } from "./useInternationalization";
import { useSetup } from "./_test";
import type { Schemas } from "#shopware";

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
      expect.stringContaining("readLanguages"),
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
