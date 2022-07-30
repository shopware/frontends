import { Product } from "@shopware-pwa/types";

/**
 * Get product free shipping property
 *
 * @public
 */
export function getProductFreeShipping(product?: Product): boolean {
  return product?.shippingFree || false;
}
