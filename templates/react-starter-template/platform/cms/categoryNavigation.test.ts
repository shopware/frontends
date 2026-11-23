import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { readNavigation } from "@/platform/shopware/reads/navigation";

import { readCategoryNavigation } from "./categoryNavigation";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/navigation", () => ({
  readNavigation: vi.fn(),
}));

const categoryNavigationPage = {
  sections: [
    {
      type: "sidebar",
      blocks: [{ slots: [{ type: "category-navigation" }] }],
    },
  ],
} as unknown as Schemas["CmsPage"];

const textPage = {
  sections: [{ type: "default", blocks: [{ slots: [{ type: "text" }] }] }],
} as unknown as Schemas["CmsPage"];

const clothing = {
  id: "clothing",
  translated: { name: "Clothing" },
  children: [],
} as unknown as Schemas["Category"];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readNavigation).mockResolvedValue([clothing]);
});

describe("readCategoryNavigation", () => {
  it("reads two levels below the root in the page language when the layout has a category navigation", async () => {
    await expect(
      readCategoryNavigation(
        categoryNavigationPage,
        "category-1",
        "language-pl",
      ),
    ).resolves.toEqual([clothing]);

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "category-1",
      2,
      "language-pl",
    );
  });

  it("reads the main navigation with the arguments of the header", async () => {
    await readCategoryNavigation(
      categoryNavigationPage,
      "main-navigation",
      null,
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "main-navigation",
      2,
      null,
    );
  });

  it("reads nothing for a layout without a category navigation", async () => {
    await expect(
      readCategoryNavigation(textPage, "main-navigation", null),
    ).resolves.toBeUndefined();
    await expect(
      readCategoryNavigation(null, "main-navigation", null),
    ).resolves.toBeUndefined();
    await expect(
      readCategoryNavigation(undefined, "main-navigation", null),
    ).resolves.toBeUndefined();

    expect(readNavigation).not.toHaveBeenCalled();
  });

  it("logs a failed read once and gives no navigation", async () => {
    const failure = new Error("offline");
    vi.mocked(readNavigation).mockRejectedValue(failure);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      readCategoryNavigation(categoryNavigationPage, "main-navigation", null),
    ).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledExactlyOnceWith(
      "[CMS] reading the category navigation failed",
      failure,
    );
    error.mockRestore();
  });
});
