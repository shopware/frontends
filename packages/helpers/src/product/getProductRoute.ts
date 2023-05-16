import { SeoUrl } from "@shopware-pwa/types";
import { getProductUrl } from "./getProductUrl";

/**
 * Returns product URL and route informations for resolving SEO url.
 * Use it with combination of <RouterLink> or <NuxtLink> in Vue.js or Nuxt.js projects.
 *
 * Example:
 * ```html
 * <RouterLink :to="getProductRoute(product)">
 * ```
 */
export function getProductRoute<
  T extends { id: string; seoUrls: SeoUrl[] | null }
>(product?: T) {
  return {
    path: getProductUrl(product),
    state: {
      routeName: "frontend.detail.page",
      foreignKey: product?.id,
    },
  };
}
