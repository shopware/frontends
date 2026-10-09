import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";
import { resolveContentLanguage } from "@/platform/shopware/reads/languages";
import { readNavigation } from "@/platform/shopware/reads/navigation";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { Header } from "./Header";

vi.mock("server-only", () => ({}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/de-DE",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveContentLanguage: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/navigation", () => ({
  readNavigation: vi.fn(),
}));

vi.mock("@/features/layout/components/MetaNavigation", () => ({
  MetaNavigation: () => <div data-testid="meta-navigation" />,
}));

vi.mock("@/features/layout/components/HeaderBar", () => ({
  HeaderBar: ({ menu }: { menu: ReactNode }) => menu,
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

function expectEveryNavigationRead(...args: unknown[]) {
  expect(readNavigation).toHaveBeenCalled();
  for (const call of vi.mocked(readNavigation).mock.calls) {
    expect(call).toEqual(args);
  }
}

function topLevelLink(html: string): string {
  const match = html.match(/<a [^>]*role="menuitem"[^>]*>Clothing<\/a>/);
  expect(match).not.toBeNull();
  return match?.[0] ?? "";
}

beforeEach(() => {
  vi.mocked(resolveContentLanguage).mockReset();
  vi.mocked(readNavigation).mockReset();
  vi.mocked(readNavigation).mockResolvedValue([clothing]);
});

describe("Header", () => {
  it("reads the main navigation in the page language and links it under the locale", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: "language-de",
      contentLang: undefined,
    });

    const html = await renderToHtml(
      withI18n(<Header locale="de-DE" />, "de-DE"),
    );

    expect(resolveContentLanguage).toHaveBeenCalledWith("de-DE");
    expect(html).toContain('data-testid="meta-navigation"');
    expect(html.indexOf('data-testid="meta-navigation"')).toBeLessThan(
      html.search(/role="menuitem"/),
    );
    expectEveryNavigationRead("main-navigation", 2, "language-de");
    expect(html).toMatch(
      /^<header class="bg-surface-surface lg:sticky lg:top-0 lg:z-30" data-sticky-header="">/,
    );
    expect(html).toContain('<div class="border-b border-shell-line">');
    expect(html).toMatch(
      /<div class="max-lg:hidden">(<!--\$-->)?<div class="relative bg-shell-ink text-shell-on-ink">/,
    );
    expect(topLevelLink(html)).toMatch(/href="\/de-DE\/Clothing\/?"/);
    expect(topLevelLink(html)).not.toContain("lang=");
  });

  it("declares the content language on the category links of a locale without its own language", async () => {
    vi.mocked(resolveContentLanguage).mockResolvedValue({
      languageId: null,
      contentLang: "en-US",
    });

    const html = await renderToHtml(
      withI18n(<Header locale="pl-PL" />, "pl-PL"),
    );

    expectEveryNavigationRead("main-navigation", 2, null);
    expect(topLevelLink(html)).toMatch(/href="\/pl-PL\/Clothing\/?"/);
    expect(topLevelLink(html)).toContain('lang="en-US"');
    expect(html).toMatch(/<nav [^>]*aria-label="Główne menu"/);
  });
});
