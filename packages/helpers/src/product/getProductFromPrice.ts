import { Product } from "@shopware-pwa/types";
import { getProductRealPrice } from "./getProductRealPrice";

/**
 * @beta
 *
 * @param {Product} product product entity
 *
 * @category Product
 */
export function getProductFromPrice(product: Product): number | undefined {
  if (!product) {
    return;
  }

  const realPrice = getProductRealPrice(product);
  const displayFromPriceLabel = product.calculatedPrices?.length > 0;

  if (displayFromPriceLabel) return realPrice?.unitPrice;
}
