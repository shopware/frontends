import { Product } from "@shopware-pwa/types";
import { UiProductReview } from "../ui-interfaces";

/**
 * Format product reviews to ui-interfaces
 *
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
 */
export function getProductReviews({
  product,
}: { product?: Product } = {}): UiProductReview[] {
  if (!product || !product.productReviews) {
    return [];
  }

  return product.productReviews.map(
    ({ id, externalUser, customerId, createdAt, content, points }) => ({
      id,
      author: externalUser ? externalUser : customerId,
      date: createdAt,
      message: content,
      rating: points,
    })
  );
}
