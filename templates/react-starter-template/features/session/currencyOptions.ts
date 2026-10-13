import { encodeForQuery } from "@shopware/api-client/helpers";

import type { ApiClient, Schemas } from "#shopware";

import { READ_TIMEOUT_MS } from "./readTimeout";

export type CurrencyOption = { id: string; isoCode: string; label: string };

export const currencyCriteria = {
  sort: [
    { field: "position", order: "ASC" },
    { field: "name", order: "ASC" },
  ],
} satisfies Schemas["Criteria"];

export function currencyLabel(
  currency: Pick<Schemas["Currency"], "isoCode" | "symbol">,
): string {
  return currency.symbol
    ? `${currency.isoCode} (${currency.symbol})`
    : currency.isoCode;
}

export function toCurrencyOptions(
  currencies: (Pick<Schemas["Currency"], "id" | "isoCode" | "symbol"> | null)[],
): CurrencyOption[] {
  return currencies.flatMap((currency) =>
    currency?.id
      ? [
          {
            id: currency.id,
            isoCode: currency.isoCode,
            label: currencyLabel(currency),
          },
        ]
      : [],
  );
}

export async function readCurrencies(
  client: Pick<ApiClient, "invoke">,
): Promise<CurrencyOption[]> {
  const { data } = await client.invoke("readCurrencyGet get /currency", {
    query: { _criteria: encodeForQuery(currencyCriteria) },
    fetchOptions: { timeout: READ_TIMEOUT_MS },
  });
  return toCurrencyOptions(data);
}
