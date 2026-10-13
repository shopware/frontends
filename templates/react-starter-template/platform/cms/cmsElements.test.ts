import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { hasCmsElement } from "./cmsElements";

function page(
  sections: { type: string; blocks?: { slots?: { type: string }[] }[] }[],
): Schemas["CmsPage"] {
  return { sections } as unknown as Schemas["CmsPage"];
}

describe("hasCmsElement", () => {
  it("finds an element in a default section", () => {
    const cmsPage = page([
      { type: "default", blocks: [{ slots: [{ type: "text" }] }] },
      {
        type: "default",
        blocks: [
          { slots: [{ type: "image" }, { type: "category-navigation" }] },
        ],
      },
    ]);

    expect(hasCmsElement(cmsPage, "category-navigation")).toBe(true);
  });

  it("finds an element in a sidebar section", () => {
    const cmsPage = page([
      {
        type: "sidebar",
        blocks: [
          { slots: [{ type: "category-navigation" }] },
          { slots: [{ type: "product-listing" }] },
        ],
      },
    ]);

    expect(hasCmsElement(cmsPage, "category-navigation")).toBe(true);
  });

  it("is false without a layout", () => {
    expect(hasCmsElement(null, "category-navigation")).toBe(false);
    expect(hasCmsElement(undefined, "category-navigation")).toBe(false);
  });

  it("is false for a layout without that element", () => {
    const cmsPage = page([
      {
        type: "sidebar",
        blocks: [
          { slots: [{ type: "text" }] },
          { slots: [{ type: "product-listing" }] },
        ],
      },
    ]);

    expect(hasCmsElement(cmsPage, "category-navigation")).toBe(false);
  });

  it("is false for sections and blocks that come without blocks or slots", () => {
    const cmsPage = page([
      { type: "default" },
      { type: "default", blocks: [{}] },
    ]);

    expect(hasCmsElement(cmsPage, "category-navigation")).toBe(false);
    expect(hasCmsElement(page([]), "category-navigation")).toBe(false);
    expect(hasCmsElement({} as Schemas["CmsPage"], "category-navigation")).toBe(
      false,
    );
  });
});
