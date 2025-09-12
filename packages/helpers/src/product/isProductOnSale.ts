/**
 * Checks if a product is on sale based on its price percentage
 */
export function isProductOnSale(product: {
  calculatedPrice: {
    listPrice?: {
      percentage?: number;
    } | null;
  };
}): boolean {
  return (product.calculatedPrice?.listPrice?.percentage ?? 0) > 0;
}
