import { Product } from "@shopware-pwa/types";
import { getProductRealPrice } from "./getProductRealPrice";

/**
 * @beta
 */
export function getProductFromPrice(product: Product): number | undefined {
  if (!product) {
    return;
  }

  const realPrice = getProductRealPrice(product);
  const displayFromPriceLabel = product.calculatedPrices?.length > 0;

  if (displayFromPriceLabel) return realPrice?.unitPrice;
}
