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
    seoUrls?: Array<{
      seoPathInfo?: string;
    }>;
  },
>(product?: T): string {
  if (!product) return "/";
  const seoUrl = product.seoUrls?.[0]?.seoPathInfo;
  return seoUrl ? `/${seoUrl}` : `/detail/${product.id}`;
}
