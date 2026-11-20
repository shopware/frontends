import "server-only";
import type { Locale } from "@/i18n/config";
import { readCanonicalSeoPath } from "@/platform/shopware/reads/canonicalSeoPath";
import { readLanguages } from "@/platform/shopware/reads/languages";

import { hreflangLocales, languageAlternates } from "./hreflang";
import type { HreflangLocale, LanguageAlternates } from "./hreflang";
import { seoPathFrom } from "./urls";

export type AlternateTarget =
  | { kind: "home" }
  | { kind: "route"; routeName: string; foreignKey: string };

export type LanguageAlternatesInput = {
  target: AlternateTarget;
  locale: Locale;
  seoPath: string | null;
  query: string;
  siteUrl: URL | null;
};

async function otherLocalePath(
  target: AlternateTarget,
  { languageId }: HreflangLocale,
): Promise<string | null> {
  if (target.kind === "home") return "/";
  const seoPathInfo = await readCanonicalSeoPath(
    target.routeName,
    target.foreignKey,
    languageId,
  ).catch(() => null);
  return seoPathFrom([{ seoPathInfo: seoPathInfo ?? undefined }]);
}

export async function buildLanguageAlternates({
  target,
  locale,
  seoPath,
  query,
  siteUrl,
}: LanguageAlternatesInput): Promise<LanguageAlternates | undefined> {
  if (!siteUrl || !seoPath) return undefined;
  try {
    const participants = hreflangLocales(await readLanguages());
    if (!participants.some((participant) => participant.locale === locale)) {
      return undefined;
    }
    const paths = await Promise.all(
      participants.map(
        async (participant) =>
          [
            participant.locale,
            participant.locale === locale
              ? seoPath
              : await otherLocalePath(target, participant),
          ] as const,
      ),
    );
    return languageAlternates(
      Object.fromEntries(
        paths.flatMap(([participant, path]) =>
          path ? [[participant, `${path}${query}`]] : [],
        ),
      ),
      siteUrl,
    );
  } catch {
    return undefined;
  }
}
