import type { ApiClient, Schemas, operations } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

import { SUGGEST_LIMIT } from "./searchTerm";

export type SearchSuggestClient = Pick<ApiClient, "invoke">;

export type SearchSuggestResult = {
  products: Schemas["Product"][];
  total: number;
};

type SearchSuggestGetHeaders = NonNullable<
  operations["searchSuggestGet get /search-suggest"]["headers"]
> & { "sw-include-seo-urls"?: boolean };

export async function readSearchSuggest(
  client: SearchSuggestClient,
  term: string,
  signal?: AbortSignal,
): Promise<SearchSuggestResult> {
  const { data } = await client.invoke("searchSuggestGet get /search-suggest", {
    headers: { "sw-include-seo-urls": true } as SearchSuggestGetHeaders,
    query: { search: term, limit: SUGGEST_LIMIT, "no-aggregations": "1" },
    fetchOptions: { timeout: READ_TIMEOUT_MS, signal },
  });
  return { products: data.elements ?? [], total: data.total ?? 0 };
}
