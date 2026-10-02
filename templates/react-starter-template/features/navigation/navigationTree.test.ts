import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { buildNavigationTree } from "./navigationTree";

function category(overrides: Record<string, unknown>): Schemas["Category"] {
  return {
    id: "category",
    type: "page",
    name: "Fallback",
    translated: {},
    children: [],
    ...overrides,
  } as unknown as Schemas["Category"];
}

describe("buildNavigationTree", () => {
  it("maps nested categories to nodes with translated names and SEO hrefs", () => {
    const tree = buildNavigationTree([
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
            children: [category({ id: "shirts", name: "Shirts" })],
          }),
        ],
      }),
    ]);

    expect(tree).toEqual([
      {
        id: "clothing",
        name: "Kleidung",
        href: "/Kleidung/",
        external: false,
        children: [
          {
            id: "men",
            name: "Men",
            href: "/Kleidung/Herren/",
            external: false,
            children: [
              {
                id: "shirts",
                name: "Shirts",
                href: "/navigation/shirts",
                external: false,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("flags categories with an external link or a new-tab link as external", () => {
    const tree = buildNavigationTree([
      category({
        id: "blog",
        name: "Blog",
        type: "link",
        linkType: "external",
        externalLink: "https://example.com/blog",
      }),
      category({
        id: "sale",
        name: "Sale",
        linkNewTab: true,
        seoUrls: [{ seoPathInfo: "Sale/" }],
      }),
      category({ id: "home", name: "Home", seoUrls: [{ seoPathInfo: "" }] }),
    ]);

    expect(tree.map((node) => [node.href, node.external])).toEqual([
      ["https://example.com/blog", true],
      ["/Sale/", true],
      ["/navigation/home", false],
    ]);
  });

  it("treats missing children as an empty list", () => {
    const tree = buildNavigationTree([
      category({ id: "leaf", name: "Leaf", children: undefined }),
    ]);

    expect(tree).toEqual([
      {
        id: "leaf",
        name: "Leaf",
        href: "/navigation/leaf",
        external: false,
        children: [],
      },
    ]);
  });

  it("returns an empty tree for undefined input", () => {
    expect(buildNavigationTree(undefined)).toEqual([]);
  });
});
