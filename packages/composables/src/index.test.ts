import { describe, expect, it, vi } from "vitest";
import * as vue from "vue";

import type { Schemas } from "#shopware";

import { getDefaultApiParams, resolveCmsComponent } from "./index";
import CmsPage from "./mocks/CmsPage";

vi.mock("vue");
describe("resolveCmsComponent", () => {
  it("should resolve a cms component", () => {
    vi.spyOn(vue, "resolveComponent").mockImplementation(() => ({}));
    const section = CmsPage.cmsPage.sections?.[0];
    const block = section?.blocks?.[0];

    const result = resolveCmsComponent(block as unknown as Schemas["CmsBlock"]);
    expect(result.componentName).toBe("image-simple-grid");
    expect(result.componentNameToResolve).toBe("CmsBlockImageSimpleGrid");
    expect(result.resolvedComponent).toEqual({});
    expect(result.isResolved).toBe(true);
  });

  it("is not resolved when Vue hands the component name back", () => {
    // resolveComponent returns the name it was given when nothing is registered
    vi.spyOn(vue, "resolveComponent").mockImplementation((element) => element);
    const section = CmsPage.cmsPage.sections?.[0];
    const block = section?.blocks?.[0];

    const result = resolveCmsComponent(block as unknown as Schemas["CmsBlock"]);
    expect(result.componentNameToResolve).toBe("CmsBlockImageSimpleGrid");
    expect(result.resolvedComponent).toBeUndefined();
    expect(result.isResolved).toBe(false);
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
      type: "sidebar",
    } as unknown as Schemas["CmsBlock"]);
    expect(result.componentNameToResolve).toBe("CmsSectionSidebar");
    expect(result.isResolved).toBe(true);
  });

  it("cms custom component", () => {
    vi.spyOn(vue, "resolveComponent").mockImplementation(() => ({}));
    const result = resolveCmsComponent({
      apiAlias: "cms_custom",
      type: "text",
    } as unknown as Schemas["CmsBlock"]);

    expect(result.componentNameToResolve).toBe("CmsElementText");
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
