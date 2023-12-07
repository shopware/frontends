import { getTranslatedProperty } from "../getTranslatedProperty";

type Product<T = unknown> = T & {
  name: string;
};

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
