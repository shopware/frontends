type CalculatedPrice = { unitPrice: number };

type ProductWithCalculatedPrice<T = unknown> = T & {
  calculatedPrice?: CalculatedPrice;
  calculatedPrices?: CalculatedPrice[];
};

/**
 * Get product real price
 *
 * @param {ProductWithCalculatedPrice} product
 * @returns {CalculatedPrice | undefined}
 */
export function getProductRealPrice(
  product: ProductWithCalculatedPrice,
): CalculatedPrice | undefined {
  if (!product) {
    return;
  }

  const real = product.calculatedPrice;
  if (product.calculatedPrices && product.calculatedPrices.length > 1) {
    return product.calculatedPrices[product.calculatedPrices.length - 1];
  }
  return real;
}
