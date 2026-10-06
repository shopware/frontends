import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";
import { cmsAssociations } from "./cmsAssociations";

export async function readProductDetail(
  productId: string,
  languageId: string | null,
): Promise<Schemas["ProductDetailResponse"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(...languageCacheTags(`sw:product:${productId}`, languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "readProductDetailGet get /product/{productId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { productId },
      query: {
        _criteria: encodeForQuery({
          associations: {
            ...cmsAssociations,
            openGraphMedia: { associations: { thumbnails: {} } },
            seoUrls: {},
          },
        }),
      },
    },
  );

  return response.data;
}
