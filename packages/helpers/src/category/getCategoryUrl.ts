import { Category } from "@shopware-pwa/types";
import { getTranslatedProperty } from "../getTranslatedProperty";

/**
 * Get URL for category.
 * Some link {@link isLinkCategory}
 *
 * @param {Category} category category entity
 *
 * @beta
 */
export const getCategoryUrl = (category: Partial<Category>): string => {
  if (!category) return "/";
  switch (category.type) {
    case "link":
      return getTranslatedProperty(category, "externalLink") || "/";
    case "folder":
      return "/";
    default:
      return category.seoUrls?.[0]?.seoPathInfo
        ? `/${category.seoUrls[0].seoPathInfo}`
        : category.id
        ? `/navigation/${category.id}`
        : "/";
  }
};
