import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { cmsAssociations } from "./cmsAssociations";

export async function readProductDetail(
  productId: string,
): Promise<Schemas["ProductDetailResponse"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(`sw:product:${productId}`);

  const response = await createShopwareClient().invoke(
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
