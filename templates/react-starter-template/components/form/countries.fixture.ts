import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

export const germany: CountryOption = {
  id: "country-de",
  name: "Germany",
  iso: "DE",
  states: [
    { id: "state-de-by", name: "Bavaria" },
    { id: "state-de-be", name: "Berlin" },
  ],
};

export const poland: CountryOption = {
  id: "country-pl",
  name: "Poland",
  iso: "PL",
  states: [],
};

export const france: CountryOption = {
  id: "country-fr",
  name: "France",
  iso: "FR",
  states: [],
};

export const unitedKingdom: CountryOption = {
  id: "country-gb",
  name: "United Kingdom",
  iso: "GB",
  states: [],
};

export const countries: CountryOption[] = [
  germany,
  poland,
  france,
  unitedKingdom,
];
