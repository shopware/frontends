import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readNavigation } from "@/platform/shopware/reads/navigation";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { Footer } from "./Footer";

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveContentLanguage: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/navigation", () => ({
  readNavigation: vi.fn(),
}));

const clothing = {
  id: "clothing",
  type: "page",
  name: "Clothing",
  translated: { name: "Clothing" },
  seoUrls: [{ seoPathInfo: "Clothing/" }],
  children: [
    {
      id: "women",
      type: "page",
      name: "Women",
      translated: { name: "Women" },
      seoUrls: [{ seoPathInfo: "Clothing/Women/" }],
      children: [],
    },
  ],
} as unknown as Schemas["Category"];

function childLink(html: string): string {
  const match = html.match(/<a [^>]*>Women<\/a>/);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

beforeEach(() => {
  vi.mocked(resolveContentLanguage).mockReset();
  vi.mocked(readNavigation).mockReset();
  vi.mocked(readNavigation).mockResolvedValue([clothing]);
});

describe("Footer", () => {
  it("reads the footer navigation in the page language and links it under the locale", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: "language-de",
      contentLang: undefined,
    });

    const html = await renderToHtml(
      withI18n(<Footer locale="de-DE" />, "de-DE"),
    );

    expect(resolveContentLanguage).toHaveBeenCalledExactlyOnceWith("de-DE");
    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "footer-navigation",
      1,
      "language-de",
    );
    expect(childLink(html)).toMatch(/href="\/de-DE\/Clothing\/Women\/?"/);
    expect(childLink(html)).not.toContain("lang=");
    expect(html).toMatch(/<a [^>]*href="\/de-DE"/);
    expect(html).toContain(">Erstellt mit Shopware Frontends und Next.js</p>");
  });

  it("stacks a sand newsletter band, the ink footer and a bottom bar", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: null,
      contentLang: undefined,
    });

    const html = await renderToHtml(withI18n(<Footer locale="en-GB" />));
    const newsletter = html.indexOf('id="newsletter-email"');
    const logo = html.indexOf('src="/logo-white.svg"');
    const bottomBar = html.indexOf(
      '<div class="border-t border-shell-on-ink/15">',
    );
    const builtWith = html.indexOf(
      ">Built with Shopware Frontends and Next.js</p>",
    );

    expect(html).toContain(
      '<footer class="bg-shell-ink text-shell-on-ink"><div class="bg-shell-sand text-shell-ink">',
    );
    expect(newsletter).toBeGreaterThan(0);
    expect(logo).toBeGreaterThan(newsletter);
    expect(html.indexOf(">Women</a>")).toBeGreaterThan(logo);
    expect(html.indexOf(">Women</a>")).toBeLessThan(bottomBar);
    expect(bottomBar).toBeGreaterThan(logo);
    expect(builtWith).toBeGreaterThan(bottomBar);
  });

  it("declares the content language on the column heading and links", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: null,
      contentLang: "en-US",
    });

    const html = await renderToHtml(
      withI18n(<Footer locale="pl-PL" />, "pl-PL"),
    );

    expect(readNavigation).toHaveBeenCalledExactlyOnceWith(
      "footer-navigation",
      1,
      null,
    );
    expect(childLink(html)).toMatch(/href="\/pl-PL\/Clothing\/Women\/?"/);
    expect(childLink(html)).toContain('lang="en-US"');
    expect(html).toContain('<p lang="en-US"');
  });
});
