import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import type { NavigationNode } from "../navigationTree";
import { MobileMenu, MobileMenuPending } from "./MobileMenu";

const tree: NavigationNode[] = [
  {
    id: "clothing",
    name: "Clothing",
    href: "/Clothing/",
    external: false,
    children: [
      {
        id: "men",
        name: "Men",
        href: "/Clothing/Men/",
        external: false,
        children: [],
      },
    ],
  },
];

describe("MobileMenu", () => {
  it("renders only the closed burger button until opened", async () => {
    const html = await renderToHtml(<MobileMenu tree={tree} />);

    expect(html.match(/<button\b/g)).toHaveLength(1);
    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toMatch(/aria-controls="[^"]+"/);
    expect(html).toContain('type="button"');
    expect(html).toContain("lg:hidden");
    expect(html).not.toContain("sidebar-left");
    expect(html).not.toContain("<dialog");
    expect(html).not.toContain("Clothing");
    expect(html).not.toContain("Close menu");
    expect(html).not.toContain("disabled");
  });

  it("renders the burger icon as decoration", async () => {
    const html = await renderToHtml(<MobileMenu tree={tree} />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("size-5 text-shell-ink");
  });

  it("appends the caller's class to the burger button", async () => {
    const html = await renderToHtml(
      <MobileMenu tree={tree} className="rounded-full p-2" />,
    );

    expect(html).toMatch(/<button[^>]*class="[^"]*lg:hidden rounded-full p-2"/);
  });
});

describe("MobileMenuPending", () => {
  it("renders a disabled, busy burger with the same box as the live one", async () => {
    const html = await renderToHtml(
      <MobileMenuPending className="rounded-full p-2" />,
    );

    expect(html.match(/<button\b/g)).toHaveLength(1);
    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
    expect(html).toMatch(/<button[^>]*class="[^"]*lg:hidden rounded-full p-2"/);
    expect(html).toContain("size-5 text-shell-ink");
    expect(html).not.toContain("aria-expanded");
    expect(html).not.toContain("aria-controls");
  });
});
