import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
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

  it("renders a sand pill with the search icon on the left and an ink focus edge", async () => {
    const html = await renderToHtml(<HeaderSearch />);

    const input = tag(html, /<input[^>]*>/);
    expect(input).toContain("rounded-full");
    expect(input).toContain("border-transparent");
    expect(input).toContain("bg-shell-sand");
    expect(input).toContain("pl-11");
    expect(input).toContain("focus-visible:border-shell-ink");
    expect(input).toContain("focus-visible:ring-shell-ink");

    const icon = tag(html, /<svg[^>]*>/);
    expect(icon).toContain("left-4");
    expect(icon).not.toContain("right-");
  });

  it("renders the Polish label and placeholder under the pl-PL provider", async () => {
    const html = await renderToHtml(withI18n(<HeaderSearch />, "pl-PL"));

    expect(tag(html, /<label[^>]*>[^<]*<\/label>/)).toContain(">Szukaj<");
    expect(tag(html, /<input[^>]*>/)).toContain(
      'placeholder="Szukaj produktów"',
    );
  });
});
