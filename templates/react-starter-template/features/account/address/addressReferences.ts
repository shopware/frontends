import "server-only";
import type { Locale } from "@/i18n/config";
import { loadCountryOptions } from "@/platform/shopware/loadCountryOptions";
import type { CountryOptions } from "@/platform/shopware/loadCountryOptions";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

import type { AddressFieldSettings } from "./addressSchema";

export type AddressReferences = CountryOptions & {
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
  settings: AddressFieldSettings;
};

async function loadSalutations(locale: Locale) {
  try {
    return {
      salutations: await readSalutations(await resolveLanguageId(locale)),
      salutationsUnavailable: false,
    };
  } catch (error) {
    console.error("[Address] reading salutations failed", error);
    return { salutations: [], salutationsUnavailable: true };
  }
}

export async function loadAddressReferences(
  locale: Locale,
): Promise<AddressReferences> {
  const [countries, salutations, { loginRegistration }] = await Promise.all([
    loadCountryOptions(locale, "Address"),
    loadSalutations(locale),
    loadShopSettings(),
  ]);
  return { ...countries, ...salutations, settings: loginRegistration };
}
