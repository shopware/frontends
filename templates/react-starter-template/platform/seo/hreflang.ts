import { defaultLocale, locales, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { findLanguageId } from "@/platform/shopware/reads/languageOptions";
import type { LanguageOption } from "@/platform/shopware/reads/languageOptions";

export type HreflangLocale = { locale: Locale; languageId: string };

export type LanguageAlternates = Partial<Record<Locale | "x-default", string>>;

export const MIN_HREFLANG_LOCALES = 2;

export function hreflangLocales(languages: LanguageOption[]): HreflangLocale[] {
  const participants = locales.flatMap((locale) => {
    const languageId = findLanguageId(languages, locale);
    return languageId ? [{ locale, languageId }] : [];
  });
  return participants.length >= MIN_HREFLANG_LOCALES ? participants : [];
}

export function languageAlternates(
  paths: Partial<Record<Locale, string>>,
  siteUrl: URL,
): LanguageAlternates | undefined {
  const alternates: LanguageAlternates = {};
  for (const locale of locales) {
    const path = paths[locale];
    if (!path) continue;
    alternates[locale] = new URL(withLocale(path, locale), siteUrl).toString();
  }
  if (Object.keys(alternates).length < MIN_HREFLANG_LOCALES) return undefined;
  const fallback = alternates[defaultLocale];
  return fallback ? { ...alternates, "x-default": fallback } : alternates;
}
