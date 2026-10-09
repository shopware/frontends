import { describe, expect, it } from "vitest";

import type { NavigationNode } from "@/features/navigation/navigationTree";
import { renderToHtml } from "@/test/render";

import { FooterColumns } from "./FooterColumns";

const tree: NavigationNode[] = [
  {
    id: "service",
    name: "Service",
    href: "/Service/",
    external: false,
    children: [
      {
        id: "contact",
        name: "Contact",
        href: "/Service/Contact/",
        external: false,
        children: [],
      },
      {
        id: "blog",
        name: "Blog",
        href: "https://example.com/blog",
        external: true,
        children: [],
      },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    href: "/Legal/",
    external: false,
    children: [],
  },
];

function anchors(html: string): string[] {
  return html.match(/<a [^>]*>/g) ?? [];
}

describe("FooterColumns", () => {
  it("renders one column per top-level node with a plain text heading", async () => {
    const html = await renderToHtml(<FooterColumns tree={tree} />);

    expect(html).toContain(
      '<p class="font-semibold text-surface-inverse-on-surface">Service</p>',
    );
    expect(html).toContain(
      '<p class="font-semibold text-surface-inverse-on-surface">Legal</p>',
    );
    expect(html).not.toContain("<h");
  });

  it("lists children only for nodes that have them", async () => {
    const html = await renderToHtml(<FooterColumns tree={tree} />);

    expect(html.match(/<ul /g)).toHaveLength(1);
    expect(html).toMatch(/href="\/Service\/Contact\/?"/);
    expect(html).toContain('href="https://example.com/blog"');
    expect(html).toContain(">Contact</a>");
    expect(html).toContain(">Blog</a>");
    expect(html).not.toMatch(/href="\/Service\/?"/);
    expect(html).not.toMatch(/href="\/Legal\/?"/);
  });

  it("opens external links in a new tab and leaves internal ones alone", async () => {
    const html = await renderToHtml(<FooterColumns tree={tree} />);
    const links = anchors(html);
    const internal = links.find((link) =>
      /href="\/Service\/Contact\/?"/.test(link),
    );
    const external = links.find((link) =>
      link.includes('href="https://example.com/blog"'),
    );

    expect(internal).toBeDefined();
    expect(internal).not.toContain("target=");
    expect(internal).not.toContain("rel=");
    expect(external).toContain('target="_blank"');
    expect(external).toContain('rel="noopener"');
  });

  it("renders nothing for an empty tree", async () => {
    const html = await renderToHtml(<FooterColumns tree={[]} />);

    expect(html).toBe("");
  });
});
