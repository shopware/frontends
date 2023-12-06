type CalculatedPrice = {
  unitPrice: number;
  listPrice?: {
    price: number;
  };
};
type ProductWithCalculatedPrice<T = unknown> = T & {
  calculatedPrice: CalculatedPrice;
  calculatedPrices?: CalculatedPrice[];
};

/**
 * Get the calculated list price
 *
 * @param {ProductWithCalculatedPrice} product product entity
 * @returns (number|undefined)
 *
 * @beta
 */
export function getProductCalculatedListingPrice(
  product?: ProductWithCalculatedPrice,
): number | undefined {
  return (
    product?.calculatedPrice?.listPrice?.price ||
    product?.calculatedPrice?.unitPrice
  );
}
