import "server-only";
import { getTranslatedProperty } from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export type SalutationOption = { label: string; value: string };

export async function readSalutations(
  languageId: string | null,
): Promise<SalutationOption[]> {
  "use cache";
  cacheLife("reference");
  cacheTag(...languageCacheTags("sw:salutations", languageId));

  const client = createShopwareClient({ languageId });
  const { data } = await client.invoke("readSalutationGet get /salutation");

  return (data.elements ?? []).map((salutation) => ({
    label: getTranslatedProperty(salutation, "displayName"),
    value: salutation.id,
  }));
}
