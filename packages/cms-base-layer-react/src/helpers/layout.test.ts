import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { defaultSection, textBlock, textSlot } from "../__fixtures__/cmsPage";
import { getCmsLayout, getSizingClassName } from "./layout";

describe("getCmsLayout", () => {
  it("turns the Vue class object into a class string and keeps margins apart from backgrounds", () => {
    const layout = getCmsLayout(textBlock);
    expect(layout.className).toBe("custom-block lg:hidden");
    expect(layout.margins).toEqual({ marginTop: "20px" });
    expect(layout.background).toEqual({});
  });

  it("returns an empty layout for slots", () => {
    const layout = getCmsLayout(textSlot);
    expect(layout.className).toBe("");
    expect(layout.margins).toEqual({});
    expect(layout.background).toEqual({});
  });

  it("reads section backgrounds and sizing", () => {
    const layout = getCmsLayout(defaultSection);
    expect(layout.background).toEqual({ backgroundColor: "#ffffff" });
    expect(layout.sizingMode).toBe("boxed");
  });

  it("builds optimized background image urls", () => {
    const layout = getCmsLayout(
      {
        ...textBlock,
        backgroundMedia: {
          url: "https://cdn/bg.jpg",
          metaData: { width: 1200, height: 600 },
        } as unknown as Schemas["Media"],
        backgroundMediaMode: "cover",
      },
      { backgroundImage: { format: "webp", quality: 80 } },
    );
    expect(layout.background.backgroundImage).toBe(
      'url("https://cdn/bg.jpg?width=1200&fit=crop,smart&format=webp&quality=80")',
    );
    expect(layout.background.backgroundSize).toBe("cover");
  });
});

describe("getSizingClassName", () => {
  it("maps sizing modes to classes", () => {
    expect(getSizingClassName("boxed")).toBe("max-w-screen-2xl w-full mx-auto");
    expect(getSizingClassName("full_width")).toBe("w-full");
    expect(getSizingClassName(null)).toBe("");
  });
});
