type CalculatedPrice = { unitPrice: number };

/**
 * Get product real price
 */
export function getProductRealPrice<
  T extends {
    calculatedPrice?: CalculatedPrice;
    calculatedPrices?: CalculatedPrice[];
  },
>(product: T): CalculatedPrice | undefined {
  if (!product) {
    return;
  }

  const real = product.calculatedPrice;
  if (product.calculatedPrices && product.calculatedPrices.length > 1) {
    return product.calculatedPrices[product.calculatedPrices.length - 1];
  }
  return real;
}
