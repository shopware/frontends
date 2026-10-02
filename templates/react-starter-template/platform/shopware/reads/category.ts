import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas, operations } from "#shopware";

import { createShopwareClient } from "../client";
import { cmsAssociations } from "./cmsAssociations";

type ReadCategoryGetQuery = NonNullable<
  operations["readCategoryGet get /category/{navigationId}"]["query"]
> & { _criteria?: string };

export async function readCategory(
  navigationId: string,
): Promise<Schemas["Category"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(`sw:category:${navigationId}`);

  const response = await createShopwareClient().invoke(
    "readCategoryGet get /category/{navigationId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { navigationId },
      query: {
        _criteria: encodeForQuery({ associations: cmsAssociations }),
      } as ReadCategoryGetQuery,
    },
  );

  return response.data;
}
