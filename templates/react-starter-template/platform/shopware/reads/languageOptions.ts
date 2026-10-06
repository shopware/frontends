import type { Schemas } from "#shopware";

export type LanguageOption = { id: string; code: string | null };

export type SalesChannelLanguages = {
  languages: LanguageOption[];
  defaultLanguageId: string | null;
};

export function toLanguageOptions(
  languages: Pick<Schemas["Language"], "id" | "translationCode">[],
): LanguageOption[] {
  return languages.map((language) => ({
    id: language.id,
    code: language.translationCode?.code ?? null,
  }));
}

export function findLanguageId(
  languages: LanguageOption[],
  locale: string,
): string | null {
  return languages.find((language) => language.code === locale)?.id ?? null;
}

function primarySubtag(code: string): string {
  return (code.split("-", 1)[0] ?? "").toLowerCase();
}

export function contentLanguageFor(
  locale: string,
  languages: LanguageOption[],
  languageId: string | null | undefined,
): string | undefined {
  const code = languages.find((language) => language.id === languageId)?.code;
  if (!code || primarySubtag(code) === primarySubtag(locale)) return undefined;
  return code;
}
