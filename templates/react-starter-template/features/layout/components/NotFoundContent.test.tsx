import { describe, expect, it } from "vitest";

import ShopNotFound from "@/app/[locale]/(shop)/not-found";
import LocaleNotFound from "@/app/[locale]/not-found";
import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { NotFoundContent } from "./NotFoundContent";

describe("NotFoundContent", () => {
  it.each([
    [
      "pl-PL",
      "Nie można znaleźć żądanej strony.",
      "/pl-PL",
      "Wróć do strony głównej",
    ],
    [
      "de-DE",
      "Die angeforderte Seite konnte nicht gefunden werden.",
      "/de-DE",
      "Zurück zur Startseite",
    ],
    ["en-GB", "The requested page cannot be found.", "/", "Back to homepage"],
  ] as const)(
    "renders the %s title, heading and home link",
    async (locale, message, home, label) => {
      const html = await renderToHtml(withI18n(<NotFoundContent />, locale));

      expect(html).toContain(`<title>${message}</title>`);
      expect(html).toMatch(new RegExp(`<h1[^>]*>${message}</h1>`));
      expect(html).toMatch(
        new RegExp(`<a [^>]*href="${home}"[^>]*>${label}</a>`),
      );
      expect(html).not.toContain("This page could not be found");
    },
  );

  it("renders inside the shop layout main and as the locale fallback with its own main", async () => {
    const shop = await renderToHtml(withI18n(<ShopNotFound />, "de-DE"));
    const fallback = await renderToHtml(withI18n(<LocaleNotFound />, "de-DE"));

    expect(shop).not.toContain("<main");
    expect(shop).toContain('data-testid="not-found"');
    expect(fallback).toContain('<main class="flex min-h-dvh flex-col">');
    expect(fallback).toContain("Zurück zur Startseite");
  });
});
