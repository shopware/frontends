import { getProductRealPrice } from "./getProductRealPrice";

type CalculatedPrice = { unitPrice: number };

/**
 *
 * @param {ProductWithCalculatedPrice} product product entity
 *
 * @returns {number | undefined} product fromPrice
 * @category Product
 */
export function getProductFromPrice<
  T extends {
    calculatedPrice?: CalculatedPrice;
    calculatedPrices?: CalculatedPrice[];
  },
>(product: T): number | undefined {
  if (!product) {
    return;
  }

  const realPrice = getProductRealPrice(product);
  const displayFromPriceLabel = (product.calculatedPrices?.length ?? 0) > 0;

  if (displayFromPriceLabel) return realPrice?.unitPrice;
}
