import { getProductUrl } from "./getProductUrl";

/**
 * Get product route information for Vue router.
 *
 * Returns product URL and route informations for resolving SEO url.
 * Use it with combination of `<RouterLink>` or `<NuxtLink>` in Vue.js or Nuxt.js projects.
 *
 * @public
 * @category Product
 * @category Routing
 */
export function getProductRoute<
  T extends {
    id: string;
    seoUrls?: Array<{
      seoPathInfo?: string;
    }>;
  },
>(product?: T) {
  return {
    path: getProductUrl(product),
    state: {
      routeName: "frontend.detail.page",
      foreignKey: product?.id,
    },
  };
}
