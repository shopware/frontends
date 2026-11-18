import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";
import type { ListingQueryParams } from "@/cms";

import { createShopwareClient } from "../client";
import { notFoundOn404 } from "../errors";
import { languageCacheTags } from "./cacheTags";

export async function readProductListing(
  categoryId: string,
  query: ListingQueryParams,
  languageId: string | null,
): Promise<Schemas["ProductListingResult"]> {
  "use cache";
  cacheLife("listing");
  cacheTag(...languageCacheTags(`sw:category:${categoryId}`, languageId));

  const response = await createShopwareClient({ languageId })
    .invoke("readProductListingGet get /product-listing/{categoryId}", {
      headers: { "sw-include-seo-urls": true },
      pathParams: { categoryId },
      query,
    })
    .catch(notFoundOn404);

  return response.data;
}
