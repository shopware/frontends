import "server-only";
import type { Locale } from "@/i18n/config";
import { readCountries } from "@/platform/shopware/reads/countries";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

export type AddressReferences = {
  countries: CountryOption[];
  countriesUnavailable: boolean;
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
};

async function loadCountries(languageId: string | null) {
  try {
    return {
      countries: await readCountries(languageId),
      countriesUnavailable: false,
    };
  } catch (error) {
    console.error("[Address] reading countries failed", error);
    return { countries: [], countriesUnavailable: true };
  }
}

async function loadSalutations(languageId: string | null) {
  try {
    return {
      salutations: await readSalutations(languageId),
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
  const languageId = await resolveLanguageId(locale);
  const [countries, salutations] = await Promise.all([
    loadCountries(languageId),
    loadSalutations(languageId),
  ]);
  return { ...countries, ...salutations };
}
