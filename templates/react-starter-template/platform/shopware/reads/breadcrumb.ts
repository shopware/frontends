import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

export type BreadcrumbType = "category" | "product";

export async function readBreadcrumb(
  id: string,
  type: BreadcrumbType,
  languageId: string | null,
): Promise<Schemas["Breadcrumb"][]> {
  "use cache";
  cacheLife("catalog");
  cacheTag(...languageCacheTags(`sw:breadcrumb:${id}`, languageId));

  const { data } = await createShopwareClient({ languageId }).invoke(
    "readBreadcrumb get /breadcrumb/{id}",
    { pathParams: { id }, query: { type } },
  );
  const breadcrumbs: Schemas["Breadcrumb"][] = Array.isArray(data) ? data : [];
  for (const breadcrumb of breadcrumbs) {
    if (breadcrumb.categoryId) {
      cacheTag(
        ...languageCacheTags(
          `sw:category:${breadcrumb.categoryId}`,
          languageId,
        ),
      );
    }
  }
  return breadcrumbs;
}

export async function readBreadcrumbOrNothing(
  id: string,
  type: BreadcrumbType,
  languageId: string | null,
): Promise<Schemas["Breadcrumb"][]> {
  try {
    return await readBreadcrumb(id, type, languageId);
  } catch (error) {
    console.error("[Catalog] reading the breadcrumb failed", error);
    return [];
  }
}
