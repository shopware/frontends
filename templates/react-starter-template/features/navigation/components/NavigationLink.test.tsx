import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { NavigationLink } from "./NavigationLink";

describe("NavigationLink", () => {
  it("renders internal nodes as same-tab links", async () => {
    const html = await renderToHtml(
      <NavigationLink
        node={{
          id: "clothing",
          name: "Clothing",
          href: "/Clothing/",
          external: false,
          children: [],
        }}
        className="nav-link"
      >
        Clothing
      </NavigationLink>,
    );

    expect(html).toMatch(/href="\/Clothing\/?"/);
    expect(html).toContain('class="nav-link"');
    expect(html).not.toContain("target=");
    expect(html).not.toContain("rel=");
  });

  it("renders external nodes in a new tab without an opener", async () => {
    const html = await renderToHtml(
      <NavigationLink
        node={{
          id: "blog",
          name: "Blog",
          href: "https://example.com/blog",
          external: true,
          children: [],
        }}
      >
        Blog
      </NavigationLink>,
    );

    expect(html).toContain('href="https://example.com/blog"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
  });
});
