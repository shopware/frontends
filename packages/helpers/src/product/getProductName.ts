import { getTranslatedProperty } from "../getTranslatedProperty";

/**
 * @beta
 *
 * @param {Product} product product entity
 *
 * @category Product
 */
export function getProductName<
  T extends {
    name: string;
  },
>({ product }: { product?: T } = {}): string | null {
  if (!product) {
    return null;
  }
  return getTranslatedProperty(product, "name");
}
