import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { encodeForQuery } from "@shopware/api-client/helpers";
import type { CmsApiViolation } from "@shopware/cms-base-layer-react/client";

import type { ApiClient, Schemas } from "#shopware";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";

export type ProductReviewsClient = Pick<ApiClient, "invoke">;

export type ProductReviewsPage = {
  reviews: Schemas["ProductReview"][];
  total: number;
  page: number;
  limit: number | null;
};

export type ProductReviewsQuery = {
  page?: number;
  limit?: number;
};

export type ProductReviewInput = {
  productId: string;
  title: string;
  content: string;
  points: number;
};

export function productReviewsCriteria({
  page = 1,
  limit,
}: ProductReviewsQuery = {}): Schemas["Criteria"] {
  const criteria: Schemas["Criteria"] = {
    page,
    sort: [{ field: "createdAt", order: "DESC" }],
  };
  return limit === undefined
    ? criteria
    : { ...criteria, limit, "total-count-mode": "exact" };
}

export async function readProductReviews(
  client: ProductReviewsClient,
  { productId, page = 1, limit }: ProductReviewsQuery & { productId: string },
): Promise<ProductReviewsPage> {
  const { data } = await client.invoke(
    "readProductReviewsGet get /product/{productId}/reviews",
    {
      pathParams: { productId },
      query: {
        _criteria: encodeForQuery(productReviewsCriteria({ page, limit })),
      },
      fetchOptions: { timeout: READ_TIMEOUT_MS },
    },
  );
  const reviews = data.elements ?? [];
  return {
    reviews,
    total: data.total ?? reviews.length,
    page: data.page ?? page,
    limit: data.limit ?? null,
  };
}

export async function saveProductReview(
  client: ProductReviewsClient,
  { productId, title, content, points }: ProductReviewInput,
): Promise<void> {
  await client.invoke("saveProductReview post /product/{productId}/review", {
    pathParams: { productId },
    body: { title, content, points },
  });
}

export function reviewViolations(error: unknown): CmsApiViolation[] | null {
  if (!(error instanceof ApiClientError)) return null;
  const errors: ApiError[] | undefined = error.details?.errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return errors.map(({ code, detail }) => ({ code, detail }));
}
