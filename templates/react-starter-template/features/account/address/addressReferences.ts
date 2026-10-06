import "server-only";
import { readCountries } from "@/platform/shopware/reads/countries";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

export type AddressReferences = {
  countries: CountryOption[];
  countriesUnavailable: boolean;
  salutations: SalutationOption[];
  salutationsUnavailable: boolean;
};

async function loadCountries() {
  try {
    return { countries: await readCountries(), countriesUnavailable: false };
  } catch (error) {
    console.error("[Address] reading countries failed", error);
    return { countries: [], countriesUnavailable: true };
  }
}

async function loadSalutations() {
  try {
    return {
      salutations: await readSalutations(),
      salutationsUnavailable: false,
    };
  } catch (error) {
    console.error("[Address] reading salutations failed", error);
    return { salutations: [], salutationsUnavailable: true };
  }
}

export async function loadAddressReferences(): Promise<AddressReferences> {
  const [countries, salutations] = await Promise.all([
    loadCountries(),
    loadSalutations(),
  ]);
  return { ...countries, ...salutations };
}
