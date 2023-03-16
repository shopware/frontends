import { Product } from "@shopware-pwa/types";

/**
 * Get product url. The priority is SEO url and then technical url.
 *
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
 */
export function getProductUrl(product: Product | null): string {
  if (!product) return "/";
  const seoUrl = product.seoUrls?.[0]?.seoPathInfo;
  return seoUrl ? `/${seoUrl}` : `/detail/${product.id}`;
}
