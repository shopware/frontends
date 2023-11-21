import type { UiProductReview } from "../ui-interfaces";

/**
 * Format product reviews to ui-interfaces
 *
 * @param {Product} product product entity
 *
 * @public
 *
 * @category Product
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
  // TODO: [OpenAPI][Product] - `ProductReview` should be an array in Product schema
  if (!product || !product.productReviews) {
    return [];
  }

  // TODO: [OpenAPI][ProductReview] - changes: id -> required; externalUser -> missing, add definition; customerId -> missing, add definition; points -> reqiored(?)

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
