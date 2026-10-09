import "server-only";
import type { ListingQueryParams } from "@shopware/cms-base-layer-react";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export async function readProductListing(
  categoryId: string,
  query: ListingQueryParams,
  languageId: string | null,
): Promise<Schemas["ProductListingResult"]> {
  "use cache";
  cacheLife("listing");
  cacheTag(...languageCacheTags(`sw:category:${categoryId}`, languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "readProductListingGet get /product-listing/{categoryId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { categoryId },
      query,
    },
  );

  return response.data;
}
