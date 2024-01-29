import { describe, expect, it } from "vitest";
import { _getVisibilityClasses } from "./getCmsLayoutConfiguration";
type FunctionParams = Parameters<typeof _getVisibilityClasses>;

describe("getVisibilityClasses", () => {
  it("should return an empty object if content is a CmsSlot or has no visibility property", () => {
    const apiAlias = "cms_slot";
    const content: FunctionParams[0] = { apiAlias };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({});
  });

  it("should return an empty object if content visibility is an empty object", () => {
    const apiAlias = "cms_block";
    const content: FunctionParams[0] = { apiAlias, visibility: {} };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({});
  });

  it("should return an empty object if there is no content visibility", () => {
    const apiAlias = "cms_block";
    const content: FunctionParams[0] = { apiAlias };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({});
  });

  it("should return the correct visibility CSS classes for tablet", () => {
    const apiAlias = "cms_block";
    const content: FunctionParams[0] = {
      apiAlias,
      visibility: {
        mobile: true,
        tablet: false,
        desktop: true,
      },
    };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({ "md:max-lg:hidden": true });
  });

  it("should return the correct visibility CSS classes for desktop", () => {
    const apiAlias = "cms_block";
    const content: FunctionParams[0] = {
      apiAlias,
      visibility: {
        mobile: true,
        tablet: true,
        desktop: false,
      },
    };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({ "lg:hidden": true });
  });

  it("should return the correct visibility CSS classes for mobile", () => {
    const apiAlias = "cms_section";
    const content: FunctionParams[0] = {
      apiAlias,
      visibility: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
    };
    const result = _getVisibilityClasses(content);
    expect(result).toEqual({ "max-md:hidden": true });
  });
});
