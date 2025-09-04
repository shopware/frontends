/**
 * Checks if a product is marked as a top seller
 */
export function isProductTopSeller(
  product: { markAsTopseller?: boolean } | undefined,
): boolean {
  return !!product?.markAsTopseller;
}
