import { SeoUrl } from "@shopware-pwa/types";

/**
 * Get product url. The priority is SEO url and then technical url.
 *
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
 */
export function getProductUrl<
  T extends {
    id: string;
    seoUrls: SeoUrl[] | null;
  }
>(product?: T): string {
  if (!product) return "/";
  const seoUrl = product.seoUrls?.[0]?.seoPathInfo;
  return seoUrl ? `/${seoUrl}` : `/detail/${product.id}`;
}

// TODO: move to separate file and add tests
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
