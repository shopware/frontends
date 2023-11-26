import { getProductRealPrice } from "./getProductRealPrice";

type CalculatedPrice =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { unitPrice: number; total: number; [key: string]: any };
type ProductWithCalculatedPrice<T = unknown> = T & {
  calculatedPrice: CalculatedPrice;
  calculatedPrices?: CalculatedPrice[];
};
/**
 *
 * @param {ProductWithCalculatedPrice} product product entity
 *
 * @returns {number | undefined} product fromPrice
 * @category Product
 */
export function getProductFromPrice(
  product: ProductWithCalculatedPrice,
): number | undefined {
  if (!product) {
    return;
  }

  const realPrice = getProductRealPrice(product);
  const displayFromPriceLabel = (product.calculatedPrices?.length ?? 0) > 0;

  if (displayFromPriceLabel) return realPrice?.unitPrice;
}
