/**
 * Get product free shipping property
 *
 * @param {Product} product product entity
 * @returns {boolean} product free shipping
 *
 * @public
 *
 * @category Product
 */
export function getProductFreeShipping<
  T extends {
    shippingFree: boolean;
  },
>(product?: T): boolean {
  return product?.shippingFree || false;
}
