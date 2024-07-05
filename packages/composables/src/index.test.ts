import { describe, expect, it } from "vitest";
import { resolveCmsComponent, getDefaultApiParams } from "./index";
import CmsPage from "./mocks/CmsPage";
import type { Schemas } from "#shopware";

describe("resolveCmsComponent", () => {
  it("should resolve a cms component", () => {
    const result = resolveCmsComponent(
      CmsPage.cmsPage.sections[0].blocks[0] as unknown as Schemas["CmsBlock"],
    );
    expect(result.componentName).toBe("image-simple-grid");
    expect(result.componentNameToResolve).toBe("CmsBlockImageSimpleGrid");
    expect(result.isResolved).toBe(true);
  });

  it("getDefaultApiParams", () => {
    const result = getDefaultApiParams();
    expect(result).toEqual({});
  });

  it("cms section component", () => {
    const result = resolveCmsComponent({
      apiAlias: "cms_section",
    } as unknown as Schemas["CmsBlock"]);
    expect(result.isResolved).toBe(true);
  });
});
