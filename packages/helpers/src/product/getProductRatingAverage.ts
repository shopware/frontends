/**
 * Get product rating average property
 *
 * @param product product entity
 *
 * @public
 *
 * @category Product
 *
 * @returns {number | null} product rating average
 */
export function getProductRatingAverage<T extends { ratingAverage: number }>(
  product: T,
): number | null {
  return product?.ratingAverage;
}
