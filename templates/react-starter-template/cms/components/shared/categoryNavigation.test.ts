import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { toCategoryNavigationItems } from "./categoryNavigation";

function category(overrides: Record<string, unknown>): Schemas["Category"] {
  return {
    type: "page",
    name: "Fallback",
    translated: {},
    children: [],
    ...overrides,
  } as unknown as Schemas["Category"];
}

describe("toCategoryNavigationItems", () => {
  it("maps categories to prefixed links with translated names", () => {
    const items = toCategoryNavigationItems(
      [
        category({
          id: "clothing",
          name: "Clothing",
          translated: { name: "Kleidung" },
          seoUrls: [{ seoPathInfo: "Kleidung/" }],
          children: [
            category({
              id: "men",
              name: "Men",
              seoUrls: [{ seoPathInfo: "Kleidung/Herren/" }],
            }),
          ],
        }),
      ],
      "de-DE",
    );

    expect(items).toEqual([
      {
        id: "clothing",
        name: "Kleidung",
        href: "/de-DE/Kleidung/",
        external: false,
        newTab: false,
        children: [
          {
            id: "men",
            name: "Men",
            href: "/de-DE/Kleidung/Herren/",
            external: false,
            newTab: false,
            children: [],
          },
        ],
      },
    ]);
  });

  it("keeps external links absolute and opens them in a new tab", () => {
    const items = toCategoryNavigationItems(
      [
        category({
          id: "external",
          name: "Shopware",
          type: "link",
          externalLink: "https://shopware.com",
        }),
        category({
          id: "new-tab",
          name: "Docs",
          type: "link",
          linkNewTab: true,
          seoUrls: [{ seoPathInfo: "docs" }],
        }),
      ],
      "de-DE",
    );

    expect(items[0]).toMatchObject({
      href: "https://shopware.com",
      external: true,
      newTab: true,
    });
    expect(items[1]).toMatchObject({
      href: "/de-DE/docs",
      external: false,
      newTab: true,
    });
  });

  it("treats missing children as an empty list", () => {
    const items = toCategoryNavigationItems(
      [category({ id: "leaf", name: "Leaf", children: undefined })],
      "",
    );

    expect(items[0]?.children).toEqual([]);
  });
});
