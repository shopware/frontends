type Product<T = unknown> = T & {
  shippingFree: boolean;
};

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
export function getProductFreeShipping(product?: Product): boolean {
  return product?.shippingFree || false;
}
