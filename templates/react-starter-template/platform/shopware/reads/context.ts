import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";

export async function readSalesChannelContext(): Promise<
  Schemas["SalesChannelContext"]
> {
  "use cache";
  cacheLife("reference");
  cacheTag("sw:context");

  const response = await createShopwareClient().invoke(
    "readContext get /context",
  );
  return response.data;
}
