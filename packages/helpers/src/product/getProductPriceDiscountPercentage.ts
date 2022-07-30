import { Product } from "@shopware-pwa/types";

/**
 * Get the percentage value of discount
 *
 * @returns (number|undefined)
 *
 * @beta
 */
export function getProductPriceDiscountPercentage(
  product: Product
): number | undefined {
  return product?.calculatedPrice?.listPrice?.percentage;
}
