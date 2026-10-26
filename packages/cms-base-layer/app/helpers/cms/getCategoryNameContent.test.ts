import type { CmsElementCategoryName } from "@shopware/composables";
import { describe, expect, it } from "vitest";

import { getCategoryNameContent } from "./getCategoryNameContent";

const element = (source: "static" | "mapped", content: string | null) =>
  ({
    type: "category-name",
    config: {
      content: {
        source,
        value: source === "mapped" ? "category.name" : "<p>static</p>",
      },
    },
    data: { content, apiAlias: "cms_text" },
  }) as unknown as CmsElementCategoryName;

describe("getCategoryNameContent", () => {
  it("wraps mapped content in the page headline", () => {
    expect(getCategoryNameContent(element("mapped", "Clothing"))).toBe(
      '<h1 class="cms-element-category-name-headline">Clothing</h1>',
    );
  });

  it("keeps entities the backend sanitizer produced", () => {
    expect(getCategoryNameContent(element("mapped", "Shoes &amp; Bags"))).toBe(
      '<h1 class="cms-element-category-name-headline">Shoes &amp; Bags</h1>',
    );
  });

  it("returns static content as authored", () => {
    expect(
      getCategoryNameContent(element("static", "<h2>Our <b>range</b></h2>")),
    ).toBe("<h2>Our <b>range</b></h2>");
  });

  it("renders no empty headline when the mapped value did not resolve", () => {
    expect(getCategoryNameContent(element("mapped", null))).toBe("");
    expect(getCategoryNameContent(element("mapped", ""))).toBe("");
  });

  it("renders no headline around a mapping path the backend returned", () => {
    const leakedPath = {
      type: "category-name",
      config: {
        content: { source: "mapped", value: "category.customFields" },
      },
      data: { content: "category.customFields", apiAlias: "cms_text" },
    } as unknown as CmsElementCategoryName;

    expect(getCategoryNameContent(leakedPath)).toBe("");
  });

  it("returns nothing for static content that did not resolve", () => {
    expect(getCategoryNameContent(element("static", null))).toBe("");
  });
});
