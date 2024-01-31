import type { UiProductReview } from "../ui-interfaces";

/**
 * Format product reviews to ui-interfaces
 *
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
 * @deprecated the method use wrong type (flow) and will be removed in the future
 */
export function getProductReviews<
  T extends {
    id: string;
    productReviews?: Array<{
      id: string;
      externalUser?: string;
      customerId?: string;
      createdAt: string;
      content: string;
      points?: number;
    }>;
  },
>({ product }: { product?: T } = {}): UiProductReview[] {
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
    }),
  );
}
