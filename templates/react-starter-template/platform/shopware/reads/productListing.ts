import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";
import type { ListingQueryParams } from "@/cms";

import { createShopwareClient } from "../client";
import { notFoundOn404 } from "../errors";

export async function readProductListing(
  categoryId: string,
  query: ListingQueryParams,
): Promise<Schemas["ProductListingResult"]> {
  "use cache";
  cacheLife("listing");
  cacheTag(`sw:category:${categoryId}`);

  const response = await createShopwareClient()
    .invoke("readProductListingGet get /product-listing/{categoryId}", {
      headers: { "sw-include-seo-urls": true },
      pathParams: { categoryId },
      query,
    })
    .catch(notFoundOn404);

  return response.data;
}
