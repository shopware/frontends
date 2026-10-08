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
      '<p class="text-xs font-semibold tracking-wide text-shell-on-ink uppercase">Service</p>',
    );
    expect(html).toContain(
      '<p class="text-xs font-semibold tracking-wide text-shell-on-ink uppercase">Legal</p>',
    );
    expect(html).not.toContain("<h");
  });

  it("styles the links for the ink footer with a visible keyboard focus", async () => {
    const html = await renderToHtml(<FooterColumns tree={tree} />);
    const links = anchors(html);

    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toContain("text-shell-on-ink-muted");
      expect(link).toContain("hover:text-shell-accent");
      expect(link).toContain("focus-visible:outline-shell-accent");
    }
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

  it("marks the Shopware names with the content language of their node", async () => {
    const html = await renderToHtml(
      <FooterColumns
        tree={[
          {
            ...tree[0]!,
            lang: "en-US",
            children: tree[0]!.children.map((child) => ({
              ...child,
              lang: "en-US",
            })),
          },
        ]}
      />,
    );

    expect(html).toContain(
      '<p lang="en-US" class="text-xs font-semibold tracking-wide text-shell-on-ink uppercase">Service</p>',
    );
    expect(anchors(html)).toHaveLength(2);
    for (const link of anchors(html)) expect(link).toContain('lang="en-US"');
  });

  it("declares no language without a content language", async () => {
    const html = await renderToHtml(<FooterColumns tree={tree} />);

    expect(html).not.toContain("lang=");
  });

  it("renders nothing for an empty tree", async () => {
    const html = await renderToHtml(<FooterColumns tree={[]} />);

    expect(html).toBe("");
  });
});
