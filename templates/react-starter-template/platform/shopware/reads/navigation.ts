import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";

export async function readNavigation(
  rootId: Schemas["NavigationType"] | string,
  depth: number,
): Promise<Schemas["NavigationRouteResponse"]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`sw:navigation:${rootId}`);

  const response = await createShopwareClient().invoke(
    "readNavigationGet get /navigation/{activeId}/{rootId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { activeId: rootId, rootId },
      query: { depth },
    },
  );

  return response.data;
}
