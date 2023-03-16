import { Product } from "@shopware-pwa/types";
import { getTranslatedProperty } from "../getTranslatedProperty";

/**
 * @beta
 *
 * @param {Product} product product entity
 *
 * @category Product
 */
export function getProductName({ product }: { product?: Product } = {}):
  | string
  | null {
  if (!product) {
    return null;
  }
  return getTranslatedProperty(product, "name");
}
