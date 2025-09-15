/**
 * Checks if a product is marked as a top seller
 */
export function isProductTopSeller(product: {
  markAsTopseller?: boolean;
}): boolean {
  return !!product.markAsTopseller;
}
