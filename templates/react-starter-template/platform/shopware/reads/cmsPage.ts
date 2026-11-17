import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { notFoundOn404 } from "../errors";

export async function readCmsPage(
  cmsPageId: string,
): Promise<Schemas["CmsPage"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(`sw:cms:${cmsPageId}`);

  const response = await createShopwareClient()
    .invoke("readCmsGet get /cms/{id}", {
      pathParams: { id: cmsPageId },
    })
    .catch(notFoundOn404);

  return response.data;
}
