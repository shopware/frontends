import { beforeEach, describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import type { NavigationNode } from "../navigationTree";
import {
  TopNavigation,
  TopNavigationPlaceholder,
  normalizePath,
  pagePath,
} from "./TopNavigation";

const route = vi.hoisted(() => ({ pathname: "/Clothing" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

beforeEach(() => {
  route.pathname = "/Clothing";
});

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

describe("pagePath", () => {
  it("drops the locale prefix and the trailing slash", () => {
    expect(pagePath("/pl-PL/Clothing/")).toBe("/Clothing");
    expect(pagePath("/de-DE/Clothing/Men")).toBe("/Clothing/Men");
    expect(pagePath("/en-GB/Clothing/")).toBe("/Clothing");
    expect(pagePath("/Clothing/")).toBe("/Clothing");
  });

  it("maps a bare locale to the root path", () => {
    expect(pagePath("/pl-PL")).toBe("/");
    expect(pagePath("/")).toBe("/");
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
    expect(html).toMatch(
      /^<div class="relative bg-shell-ink text-shell-on-ink"/,
    );
    expect(html).toMatch(/<div class="[^"]*min-h-12[^"]*"><\/div>/);
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
    expect(html).toMatch(/<ul role="menubar" class="[^"]*min-h-12[^"]*">/);
    expect(anchors(html)).toHaveLength(0);
  });

  it("marks only nodes with children as popup triggers", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);
    const [clothing, food, blog] = anchors(html);

    expect(clothing).toContain('aria-haspopup="true"');
    expect(clothing).toContain('aria-expanded="false"');
    expect(food).not.toContain("aria-haspopup");
    expect(food).not.toMatch(/\saria-expanded="/);
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
    expect(clothing).toContain("aria-[current=page]:text-shell-accent");
    expect(clothing).toContain("aria-[current=page]:border-b-shell-accent");
    expect(clothing?.match(/class="([^"]*)"/)?.[1]).toBe(
      food?.match(/class="([^"]*)"/)?.[1],
    );
  });

  it("keeps the band on one scrollable row so the header height stays fixed", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);
    const list = html.match(/<ul role="menubar" class="([^"]*)">/)?.[1] ?? "";

    expect(list.split(" ")).toEqual(
      expect.arrayContaining([
        "min-h-12",
        "justify-center-safe",
        "overflow-x-auto",
      ]),
    );
    expect(list).not.toContain("flex-wrap");
    expect(html.match(/<li role="none" class="flex shrink-0"/g)).toHaveLength(
      3,
    );
  });

  it("centers the top-level items on the ink band in uppercase with accent hover, active and focus states", async () => {
    const html = await renderToHtml(<TopNavigation tree={tree} />);

    expect(html).toMatch(
      /^<div class="relative bg-shell-ink text-shell-on-ink"/,
    );
    expect(html).toMatch(
      /<ul role="menubar" class="[^"]*justify-center[^"]*">/,
    );
    for (const item of anchors(html)) {
      expect(item).toContain("whitespace-nowrap");
      expect(item).toContain("uppercase");
      expect(item).toContain("tracking-wide");
      expect(item).toContain("font-semibold");
      expect(item).toContain("hover:text-shell-accent");
      expect(item).toContain("hover:border-b-shell-accent");
      expect(item).toContain("focus-visible:outline-shell-accent");
    }
  });

  it("labels the menubar in Polish and marks the prefixed current page under the pl-PL provider", async () => {
    route.pathname = "/pl-PL/Food";
    const polishTree = [
      node({ id: "clothing", name: "Odzież", href: "/pl-PL/Clothing/" }),
      node({ id: "food", name: "Żywność", href: "/pl-PL/Food/" }),
    ];
    const html = await renderToHtml(
      withI18n(<TopNavigation tree={polishTree} />, "pl-PL"),
    );
    const [clothing, food] = anchors(html);

    expect(html).toContain('aria-label="Główne menu"');
    expect(clothing).toMatch(/href="\/pl-PL\/Clothing\/?"/);
    expect(clothing).not.toContain("aria-current");
    expect(food).toMatch(/href="\/pl-PL\/Food\/?"/);
    expect(food).toContain('aria-current="page"');
  });
});
