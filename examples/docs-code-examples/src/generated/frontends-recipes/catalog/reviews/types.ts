import type { Schemas, operations } from "#shopware";

type ReviewsCriteria =
  operations["readProductReviews post /product/{productId}/reviews"]["body"];
type ReviewsResponse =
  operations["readProductReviews post /product/{productId}/reviews"]["response"];
type SaveReviewBody =
  operations["saveProductReview post /product/{productId}/review"]["body"];
type ProductReview = Schemas["ProductReview"];
