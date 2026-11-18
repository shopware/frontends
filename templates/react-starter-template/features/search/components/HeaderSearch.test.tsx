import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { HeaderSearch } from "./HeaderSearch";

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

describe("HeaderSearch", () => {
  it("renders a labelled search input with the e2e test id", async () => {
    const html = await renderToHtml(<HeaderSearch className="w-full" />);

    const label = tag(html, /<label[^>]*>[^<]*<\/label>/);
    expect(label).toContain('for="search-input"');
    expect(label).toContain("sr-only");
    expect(label).toContain(">Search<");

    const input = tag(html, /<input[^>]*>/);
    expect(input).toContain('id="search-input"');
    expect(input).toContain('type="search"');
    expect(input).toContain('name="search"');
    expect(input).toContain('data-testid="header-search-input"');
    expect(input).toContain('placeholder="Search for products"');
    expect(input).toMatch(/autocomplete="off"/i);

    expect(html).toMatch(/<div class="relative w-full">/);
    expect(html).toContain("<svg");
  });
});
