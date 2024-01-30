type CalculatedPrice = {
  unitPrice?: number;
  listPrice?: {
    price: number;
  };
};

/**
 * Get the calculated list price
 *
 * @param {ProductWithCalculatedPrice} product product entity
 * @returns (number|undefined)
 *
 * @beta
 */
export function getProductCalculatedListingPrice<
  T extends {
    calculatedPrice?: CalculatedPrice;
    calculatedPrices?: CalculatedPrice[];
  },
>(product?: T): number | undefined {
  return (
    product?.calculatedPrice?.listPrice?.price ||
    product?.calculatedPrice?.unitPrice
  );
}
