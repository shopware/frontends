import { Product } from "@shopware-pwa/types";

/**
 * Get product rating average property
 * 
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
 */
export function getProductRatingAverage(product: Product): number | null {
  return product?.ratingAverage;
}
