import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export async function readNavigation(
  rootId: Schemas["NavigationType"] | string,
  depth: number,
  languageId: string | null,
): Promise<Schemas["NavigationRouteResponse"]> {
  "use cache";
  cacheLife("hours");
  cacheTag(...languageCacheTags(`sw:navigation:${rootId}`, languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "readNavigationGet get /navigation/{activeId}/{rootId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { activeId: rootId, rootId },
      query: { depth },
    },
  );

  return response.data;
}
