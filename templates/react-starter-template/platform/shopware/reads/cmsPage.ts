import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { notFoundOn404 } from "../errors";
import { languageCacheTags } from "./cacheTags";

export async function readCmsPage(
  cmsPageId: string,
  languageId: string | null,
): Promise<Schemas["CmsPage"]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(...languageCacheTags(`sw:cms:${cmsPageId}`, languageId));

  const response = await createShopwareClient({ languageId })
    .invoke("readCmsGet get /cms/{id}", {
      pathParams: { id: cmsPageId },
    })
    .catch(notFoundOn404);

  return response.data;
}
