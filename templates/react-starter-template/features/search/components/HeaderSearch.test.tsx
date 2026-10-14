import { describe, expect, it, vi } from "vitest";

import type { Locale } from "@/i18n/config";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { HeaderSearch } from "./HeaderSearch";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
}));

function tag(html: string, pattern: RegExp): string {
  const match = html.match(pattern);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

function render(
  props: { value?: string; className?: string } = {},
  locale?: Locale,
) {
  return renderToHtml(
    withI18n(
      <HeaderSearch
        value={props.value ?? ""}
        onValueChange={() => {}}
        className={props.className}
      />,
      locale,
    ),
  );
}

describe("HeaderSearch", () => {
  it("renders a labelled search input with the e2e test id inside a search landmark", async () => {
    const html = await render({ className: "w-full" });

    expect(html).toMatch(/^<search class="relative w-full">/);
    const form = tag(html, /<form[^>]*>/);
    expect(form).toContain('method="get"');
    expect(form).toContain('action="/search"');
    expect(form).not.toContain("role=");

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
    expect(input).toMatch(/enterkeyhint="search"/i);
    expect(input).toContain('value=""');
    expect(input).not.toContain("aria-controls");
    expect(input).not.toContain("aria-expanded");

    expect(html).toContain("<svg");
    expect(html.match(/<output[^>]*>/g)).toEqual(['<output class="sr-only">']);
    expect(html).not.toMatch(/<button/);
  });

  it("renders no suggestion box on the server, even with a long enough term", async () => {
    const html = await render({ value: "shirt" });

    expect(tag(html, /<input[^>]*>/)).toContain('value="shirt"');
    expect(html).not.toContain("layout-search-result-box");
  });

  it("renders a sand pill with the search icon on the left and an ink focus edge", async () => {
    const html = await render();

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

  it("submits to the prefixed search page with the Polish label and placeholder under the pl-PL provider", async () => {
    const html = await render({}, "pl-PL");

    expect(tag(html, /<form[^>]*>/)).toContain('action="/pl-PL/search"');
    expect(tag(html, /<label[^>]*>[^<]*<\/label>/)).toContain(">Szukaj<");
    expect(tag(html, /<input[^>]*>/)).toContain(
      'placeholder="Szukaj produktów"',
    );
  });
});
