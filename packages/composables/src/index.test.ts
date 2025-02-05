import { describe, expect, it, vi } from "vitest";
import * as vue from "vue";
import type { Schemas } from "#shopware";
import { getDefaultApiParams, resolveCmsComponent } from "./index";
import CmsPage from "./mocks/CmsPage";

vi.mock("vue");
describe("resolveCmsComponent", () => {
  vi.spyOn(vue, "resolveComponent").mockImplementation((element) => element);
  it("should resolve a cms component", () => {
    const result = resolveCmsComponent(
      CmsPage.cmsPage.sections[0].blocks[0] as unknown as Schemas["CmsBlock"],
    );
    expect(result.componentName).toBe("image-simple-grid");
    expect(result.componentNameToResolve).toBe("CmsBlockImageSimpleGrid");
    expect(result.isResolved).toBe(true);
  });

  it("getDefaultApiParams", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = getDefaultApiParams();
    expect(result).toEqual({});
    expect(console.error).toHaveBeenCalledWith(
      "[@shopware/composables] `getDefaultApiParams` is deprecated and will be removed in the next major release.",
    );
  });

  it("cms section component", () => {
    vi.spyOn(vue, "resolveComponent").mockImplementation(() => ({}));
    const result = resolveCmsComponent({
      apiAlias: "cms_section",
    } as unknown as Schemas["CmsBlock"]);
    expect(result.isResolved).toBe(true);
  });

  it("cms custom component", () => {
    const result = resolveCmsComponent({
      apiAlias: "cms_custom",
    } as unknown as Schemas["CmsBlock"]);

    expect(result.isResolved).toBe(true);
  });

  it("component should not be resolved because of the error", () => {
    vi.spyOn(vue, "resolveComponent").mockImplementation(() => {
      throw new Error("error");
    });
    const result = resolveCmsComponent({
      apiAlias: "cms_custom",
    } as unknown as Schemas["CmsBlock"]);

    expect(result.isResolved).toBe(false);
  });
});
