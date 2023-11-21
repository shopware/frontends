/**
 * @beta
 */
export type TierPrice = {
  label: string; // information about the quantity range
  quantity: number; // price limit value
  unitPrice: number; // price for only one product in given price range (quantity)
};

/**
 * Get the prices depending on quantity added to cart.
 * Tier prices can be set in `Advanced pricing` tab in `Product view` (admin panel)
 *
 * @param {Product} product product entity
 *
 * @returns TierPrice[]
 * @beta
 */
export function getProductTierPrices<
  T extends {
    calculatedPrices?: Array<{
      unitPrice: number;
      quantity: number;
    }>;
  },
>(product?: T): TierPrice[] {
  if (!product || !product.calculatedPrices?.length) {
    return [];
  }
  const size = product.calculatedPrices.length;

  return product.calculatedPrices.map(({ unitPrice, quantity }, index) => ({
    label: index === size - 1 ? `from ${quantity}` : `to ${quantity}`,
    quantity,
    unitPrice,
  }));
}
