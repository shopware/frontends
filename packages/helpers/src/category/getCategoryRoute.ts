import { Category } from "@shopware-pwa/types";
import { getCategoryUrl } from "./getCategoryUrl";
type LinkedCategory = Pick<
  Category,
  "type" | "externalLink" | "seoUrls" | "internalLink" | "id" | "linkType"
>;

/**
 * Get category/navigation route information for Vue Router.
 *
 * Returns category or navigation URL and route informations for resolving SEO url.
 * Use it with combination of `<RouterLink>` or `<NuxtLink>` in Vue.js or Nuxt.js projects.
 *
 * Example:
 * ```html
 * <RouterLink :to="getCategoryRoute(navigationElement)">
 * ```
 *
 * @public
 * @category Category
 * @category Routing
 */
export function getCategoryRoute(category: LinkedCategory) {
  if (!category) return "/";
  if (
    category.type === "page" ||
    (category.type === "link" && category.linkType === "category")
  ) {
    return {
      path: getCategoryUrl(category),
      state: {
        routeName: "frontend.navigation.page",
        foreignKey: category?.id,
      },
    };
  }
  if (category.type === "link" && category.linkType === "product") {
    return {
      path: getCategoryUrl(category),
      state: {
        routeName: "frontend.detail.page",
        foreignKey: category?.internalLink,
      },
    };
  }
  if (category.type === "link" && category.linkType === "landing_page") {
    return {
      path: getCategoryUrl(category),
      state: {
        routeName: "frontend.landing.page",
        foreignKey: category?.internalLink,
      },
    };
  }
  return getCategoryUrl(category);
}
