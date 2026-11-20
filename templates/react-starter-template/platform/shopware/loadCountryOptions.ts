import "server-only";
import type { Locale } from "@/i18n/config";

import { readCountries } from "./reads/countries";
import type { CountryOption } from "./reads/countryOptions";
import { resolveLanguageId } from "./reads/languages";

export type CountryOptions = {
  countries: CountryOption[];
  countriesUnavailable: boolean;
};

export async function loadCountryOptions(
  locale: Locale,
  logLabel: string,
): Promise<CountryOptions> {
  try {
    const languageId = await resolveLanguageId(locale);
    return {
      countries: await readCountries(languageId),
      countriesUnavailable: false,
    };
  } catch (error) {
    console.error(`[${logLabel}] reading countries failed`, error);
    return { countries: [], countriesUnavailable: true };
  }
}
