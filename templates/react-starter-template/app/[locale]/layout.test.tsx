import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import { renderToHtml } from "@/test/render";

import RootLayout, { generateMetadata, generateStaticParams } from "./layout";

vi.mock("server-only", () => ({}));

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter" }),
}));

vi.mock("@/features/storefront/components/StorefrontProviders", () => ({
  StorefrontProviders: ({ children }: { children: ReactNode }) => children,
}));

function params(locale: string) {
  return Promise.resolve({ locale });
}

function Probe() {
  const t = useTranslations();
  const localePath = useLocalePath();
  return (
    <a href={localePath("/account")}>{t("loginForm.submitButtonLabel")}</a>
  );
}

describe("RootLayout", () => {
  it("prerenders every locale", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "en-GB" },
      { locale: "pl-PL" },
      { locale: "de-DE" },
    ]);
  });

  it("keeps the brand title template and translates the description", async () => {
    const english = await generateMetadata({ params: params("en-GB") });
    const german = await generateMetadata({ params: params("de-DE") });

    expect(english.title).toEqual({
      default: "Shopware Frontends Demo Store",
      template: "%s | Shopware Frontends Demo Store",
    });
    expect(english.description).toBe(
      "A Next.js storefront template for Shopware 6.",
    );
    expect(german.title).toEqual(english.title);
    expect(german.description).toBe(
      "Eine Next.js-Storefront-Vorlage für Shopware 6.",
    );
  });

  it("rejects an unknown locale with a not-found", async () => {
    await expect(
      generateMetadata({ params: params("xx-XX") }),
    ).rejects.toMatchObject({ digest: expect.stringContaining("404") });
    await expect(
      RootLayout({ params: params("xx-XX"), children: null }),
    ).rejects.toMatchObject({ digest: expect.stringContaining("404") });
  });

  it.each([
    ["pl-PL", "Zaloguj się"],
    ["de-DE", "Anmelden"],
  ])(
    "renders the %s locale into <html lang> and the client translations",
    async (locale, label) => {
      const html = await renderToHtml(
        await RootLayout({ params: params(locale), children: <Probe /> }),
      );

      expect(html).toContain(`<html lang="${locale}"`);
      expect(html).toContain(label);
      expect(html).toContain(`href="/${locale}/account"`);
    },
  );
});
