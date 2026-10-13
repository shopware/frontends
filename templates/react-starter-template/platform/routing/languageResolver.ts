import { findLanguageId } from "@/platform/shopware/reads/languageOptions";
import type { LanguageOption } from "@/platform/shopware/reads/languageOptions";

export const LANGUAGES_TTL_MS = 3_600_000;
export const LANGUAGES_RETRY_MS = 60_000;

export type LanguageResolution =
  | { status: "resolved"; languageId: string | null }
  | { status: "unavailable" };

export type LanguageResolver = (locale: string) => Promise<LanguageResolution>;

export function createLanguageResolver({
  read,
  now = Date.now,
  onFailure,
}: {
  read: () => Promise<LanguageOption[]>;
  now?: () => number;
  onFailure?: (error: unknown) => void;
}): LanguageResolver {
  let known: { options: LanguageOption[] | null; until: number } | null = null;
  let pending: Promise<LanguageOption[] | null> | null = null;

  function load(): Promise<LanguageOption[] | null> {
    if (!pending) {
      const run = read()
        .then((options): LanguageOption[] | null => {
          known = { options, until: now() + LANGUAGES_TTL_MS };
          return options;
        })
        .catch((error: unknown) => {
          onFailure?.(error);
          const options = known?.options ?? null;
          known = { options, until: now() + LANGUAGES_RETRY_MS };
          return options;
        })
        .finally(() => {
          if (pending === run) pending = null;
        });
      pending = run;
    }
    return pending;
  }

  return async (locale) => {
    const options = known && now() < known.until ? known.options : await load();
    if (!options) return { status: "unavailable" };
    return { status: "resolved", languageId: findLanguageId(options, locale) };
  };
}
