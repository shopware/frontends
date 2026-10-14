import "server-only";
import type { RegistrationSettings } from "@/features/account/registrationSchema";
import { apiFailureSummary } from "@/features/session/apiErrors";
import type { Locale } from "@/i18n/config";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

export type RegistrationReferences = {
  settings: RegistrationSettings;
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
  birthYearMax: number;
};

async function loadSalutations(
  languageId: string | null,
): Promise<
  Pick<RegistrationReferences, "salutations" | "salutationsUnavailable">
> {
  try {
    return {
      salutations: await readSalutations(languageId),
      salutationsUnavailable: false,
    };
  } catch (error) {
    console.error(
      "[Registration] reading salutations failed",
      apiFailureSummary(error),
    );
    return { salutations: [], salutationsUnavailable: true };
  }
}

export async function loadRegistrationReferences(
  locale: Locale,
): Promise<RegistrationReferences> {
  const [{ loginRegistration }, languageId] = await Promise.all([
    loadShopSettings(),
    resolveLanguageId(locale),
  ]);
  const salutations = loginRegistration.showSalutation
    ? await loadSalutations(languageId)
    : { salutations: [], salutationsUnavailable: false };
  return {
    settings: loginRegistration,
    ...salutations,
    birthYearMax: new Date().getFullYear(),
  };
}
