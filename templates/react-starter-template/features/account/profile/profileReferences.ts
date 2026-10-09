import "server-only";
import type { Locale } from "@/i18n/config";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

export type ProfileReferences = {
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
};

export async function loadProfileReferences(
  locale: Locale,
): Promise<ProfileReferences> {
  const languageId = await resolveLanguageId(locale);
  try {
    return {
      salutations: await readSalutations(languageId),
      salutationsUnavailable: false,
    };
  } catch (error) {
    console.error("[Profile] reading salutations failed", error);
    return { salutations: [], salutationsUnavailable: true };
  }
}
