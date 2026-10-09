import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import type { NavigationNode } from "../navigationTree";
import {
  TopNavigation,
  TopNavigationPlaceholder,
  normalizePath,
} from "./TopNavigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/Clothing",
}));

function node(overrides: Partial<NavigationNode>): NavigationNode {
  return {
    id: "node",
    name: "Node",
    href: "/node/",
    external: false,
    children: [],
    ...overrides,
  };
}

const tree: NavigationNode[] = [
  node({
    id: "clothing",
    name: "Clothing",
    href: "/Clothing/",
    children: [
      node({
        id: "men",
        name: "Men",
        href: "/Clothing/Men/",
        children: [node({ id: "shirts", name: "Shirts" })],
      }),
    ],
  }),
  node({ id: "food", name: "Food", href: "/Food/" }),
  node({
    id: "blog",
    name: "Blog",
    href: "https://example.com/blog",
    external: true,
  }),
];

function anchors(html: string): string[] {
  return html.match(/<a\b[^>]*>/g) ?? [];
}

describe("normalizePath", () => {
  it("strips trailing slashes from nested paths", () => {
    expect(normalizePath("/Clothing/")).toBe("/Clothing");
    expect(normalizePath("/Clothing//")).toBe("/Clothing");
    expect(normalizePath("/Clothing/Men")).toBe("/Clothing/Men");
  });

  it("keeps the root path", () => {
    expect(normalizePath("/")).toBe("/");
  });
});

describe("TopNavigationPlaceholder", () => {
  it("reserves the navigation row without rendering a nav or calling hooks", async () => {
    const html = await renderToHtml(<TopNavigationPlaceholder />);
    const live = await renderToHtml(<TopNavigation tree={[]} />);
    const classes = (markup: string) => markup.match(/class="([^"]*)"/g) ?? [];

    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("<nav");
    expect(html).not.toContain("<ul");
    expect(anchors(html)).toHaveLength(0);
    expect(classes(html)).toEqual(classes(live));
  });
});

describe("TopNavigation", () => {
  it("renders a labelled menubar with one menuitem link per top-level node", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);

    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toContain('role="menubar"');
    expect(html.match(/role="none"/g)).toHaveLength(3);
    expect(html.match(/role="menuitem"/g)).toHaveLength(3);
    expect(anchors(html)).toHaveLength(3);
    expect(html).not.toContain("Shirts");
  });

  it("reserves the row height for an empty tree", async () => {
    const html = await renderToHtml(<TopNavigation tree={[]} />);

    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toMatch(
      /<ul role="menubar" class="[^"]*min-h-\[25px\][^"]*">/,
    );
    expect(anchors(html)).toHaveLength(0);
  });

  it("marks only nodes with children as popup triggers", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);
    const [clothing, food, blog] = anchors(html);

    expect(clothing).toContain('aria-haspopup="true"');
    expect(clothing).toContain('aria-expanded="false"');
    expect(food).not.toContain("aria-haspopup");
    expect(food).not.toContain("aria-expanded");
    expect(blog).not.toContain("aria-haspopup");
  });

  it("opens external nodes in a new tab and internal nodes in the same tab", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);
    const [clothing, food, blog] = anchors(html);

    expect(blog).toContain('href="https://example.com/blog"');
    expect(blog).toContain('target="_blank"');
    expect(blog).toContain('rel="noopener"');
    expect(clothing).toMatch(/href="\/Clothing\/?"/);
    expect(clothing).not.toContain("target=");
    expect(food).not.toContain("target=");
  });

  it("marks the node matching the pathname as the current page regardless of the trailing slash", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);
    const [clothing, food] = anchors(html);

    expect(clothing).toContain('aria-current="page"');
    expect(food).not.toContain("aria-current");
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html.match(/ border-surface-on-surface"/g)).toHaveLength(1);
  });
});
