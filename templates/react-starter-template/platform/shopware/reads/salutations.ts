import "server-only";
import { getTranslatedProperty } from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";

export type SalutationOption = { label: string; value: string };

export async function readSalutations(): Promise<SalutationOption[]> {
  "use cache";
  cacheLife("reference");
  cacheTag("sw:salutations");

  const client = createShopwareClient();
  const { data } = await client.invoke("readSalutationGet get /salutation");

  return (data.elements ?? []).map((salutation) => ({
    label: getTranslatedProperty(salutation, "displayName"),
    value: salutation.id,
  }));
}
