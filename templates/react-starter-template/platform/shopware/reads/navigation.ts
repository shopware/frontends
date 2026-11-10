import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";

export async function readNavigation(
  type: Schemas["NavigationType"],
  depth: number,
): Promise<Schemas["NavigationRouteResponse"]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`sw:navigation:${type}`);

  const response = await createShopwareClient().invoke(
    "readNavigationGet get /navigation/{activeId}/{rootId}",
    {
      headers: { "sw-include-seo-urls": true },
      pathParams: { activeId: type, rootId: type },
      query: { depth },
    },
  );

  return response.data;
}
