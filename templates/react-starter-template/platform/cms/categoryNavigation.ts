import "server-only";
import type { Schemas } from "#shopware";

import { readNavigation } from "../shopware/reads/navigation";
import { hasCmsElement } from "./cmsElements";

const CATEGORY_NAVIGATION_DEPTH = 2;

export async function readCategoryNavigation(
  cmsPage: Schemas["CmsPage"] | null | undefined,
  rootId: Schemas["NavigationType"] | string,
  languageId: string | null,
): Promise<Schemas["Category"][] | undefined> {
  if (!hasCmsElement(cmsPage, "category-navigation")) return undefined;

  try {
    return await readNavigation(rootId, CATEGORY_NAVIGATION_DEPTH, languageId);
  } catch (error) {
    console.error("[CMS] reading the category navigation failed", error);
    return undefined;
  }
}
