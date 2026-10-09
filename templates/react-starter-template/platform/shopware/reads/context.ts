import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export async function readSalesChannelContext(
  languageId: string | null,
): Promise<Schemas["SalesChannelContext"]> {
  "use cache";
  cacheLife("reference");
  cacheTag(...languageCacheTags("sw:context", languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "readContext get /context",
  );
  return response.data;
}
