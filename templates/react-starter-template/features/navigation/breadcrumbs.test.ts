import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { toBreadcrumbItems } from "./breadcrumbs";

function crumb(overrides: Record<string, unknown>): Schemas["Breadcrumb"] {
  return {
    categoryId: "c",
    name: "Name",
    path: "",
    type: "page",
    translated: {},
    ...overrides,
  } as unknown as Schemas["Breadcrumb"];
}

describe("toBreadcrumbItems", () => {
  it("links pages under the locale and prefers the translated name", () => {
    expect(
      toBreadcrumbItems(
        [
          crumb({
            categoryId: "a",
            path: "Furniture/",
            translated: { name: "Meble" },
          }),
        ],
        "pl-PL",
      ),
    ).toEqual([{ key: "a", name: "Meble", href: "/pl-PL/Furniture/" }]);
  });

  it("leaves folders unlinked and keeps external links external", () => {
    expect(
      toBreadcrumbItems(
        [
          crumb({ categoryId: "f", type: "folder", path: "" }),
          crumb({
            categoryId: "l",
            type: "link",
            path: "navigation/l",
            translated: { externalLink: "https://blog.test" },
          }),
        ],
        "en-GB",
      ),
    ).toEqual([
      { key: "f", name: "Name" },
      { key: "l", name: "Name", href: "https://blog.test", external: true },
    ]);
  });
});
