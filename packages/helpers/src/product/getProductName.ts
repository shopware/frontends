import { Product } from "@shopware-pwa/types";
import { getTranslatedProperty } from "../getTranslatedProperty";

/**
 * @beta
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
