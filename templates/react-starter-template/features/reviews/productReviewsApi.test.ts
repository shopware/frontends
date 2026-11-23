import { encodeForQuery } from "@shopware/api-client/helpers";
import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";
import { fakeClient } from "@/features/checkout/checkout.fixture";
import { READ_TIMEOUT_MS } from "@/features/session/readTimeout";
import { apiClientError } from "@/features/session/session.fixture";

import {
  productReviewsCriteria,
  readProductReviews,
  reviewViolations,
  saveProductReview,
} from "./productReviewsApi";

const READ = "readProductReviewsGet get /product/{productId}/reviews";
const SAVE = "saveProductReview post /product/{productId}/review";

function review(
  overrides: Partial<Schemas["ProductReview"]> = {},
): Schemas["ProductReview"] {
  return {
    id: "review-1",
    productId: "variant-1",
    salesChannelId: "sales-channel-1",
    languageId: "language-1",
    title: "Solid chair",
    content: "Sturdy and comfortable for long working days at the desk.",
    points: 4,
    status: true,
    ...overrides,
  };
}

describe("productReviewsCriteria", () => {
  it("asks for the newest reviews first and leaves the page size to the shop", () => {
    expect(productReviewsCriteria()).toEqual({
      page: 1,
      sort: [{ field: "createdAt", order: "DESC" }],
    });
  });

  it("asks for an exact total together with an explicit limit", () => {
    expect(productReviewsCriteria({ page: 2, limit: 5 })).toEqual({
      page: 2,
      limit: 5,
      sort: [{ field: "createdAt", order: "DESC" }],
      "total-count-mode": "exact",
    });
  });
});

describe("readProductReviews", () => {
  it("reads over GET with the criteria in _criteria and the read timeout", async () => {
    const reviews = [review(), review({ id: "review-2", status: false })];
    const { client, invocations } = fakeClient(() => ({
      elements: reviews,
      total: 2,
      page: 1,
      limit: 10,
    }));

    await expect(
      readProductReviews(client, { productId: "parent-1" }),
    ).resolves.toEqual({ reviews, total: 2, page: 1, limit: 10 });

    expect(invocations).toEqual([
      {
        operation: READ,
        params: {
          pathParams: { productId: "parent-1" },
          query: { _criteria: encodeForQuery(productReviewsCriteria()) },
          fetchOptions: { timeout: READ_TIMEOUT_MS },
        },
      },
    ]);
  });

  it("passes page and limit into the criteria", async () => {
    const { client, invocations } = fakeClient(() => ({ elements: [] }));

    await readProductReviews(client, {
      productId: "parent-1",
      page: 3,
      limit: 5,
    });

    expect(invocations[0]?.params).toMatchObject({
      query: {
        _criteria: encodeForQuery(
          productReviewsCriteria({ page: 3, limit: 5 }),
        ),
      },
    });
  });

  it("falls back to the list itself when elements, total, page or limit are missing", async () => {
    const { client: empty } = fakeClient(() => ({}));
    await expect(
      readProductReviews(empty, { productId: "parent-1", page: 2 }),
    ).resolves.toEqual({ reviews: [], total: 0, page: 2, limit: null });

    const { client: untotalled } = fakeClient(() => ({
      elements: [review()],
    }));
    await expect(
      readProductReviews(untotalled, { productId: "parent-1" }),
    ).resolves.toEqual({ reviews: [review()], total: 1, page: 1, limit: null });
  });

  it("lets a failed read throw", async () => {
    const failure = apiClientError(
      [{ code: "PRODUCT__REVIEW_NOT_ACTIVE", status: "403" }],
      403,
    );
    const { client } = fakeClient(() => {
      throw failure;
    });

    await expect(
      readProductReviews(client, { productId: "parent-1" }),
    ).rejects.toBe(failure);
  });
});

describe("saveProductReview", () => {
  it("posts title, content and points under the product id", async () => {
    const { client, invocations } = fakeClient(() => undefined);

    await saveProductReview(client, {
      productId: "variant-1",
      title: "Great chair",
      content: "Comfortable, sturdy and easy to assemble in ten minutes.",
      points: 5,
    });

    expect(invocations).toEqual([
      {
        operation: SAVE,
        params: {
          pathParams: { productId: "variant-1" },
          body: {
            title: "Great chair",
            content: "Comfortable, sturdy and easy to assemble in ten minutes.",
            points: 5,
          },
        },
      },
    ]);
  });
});

describe("reviewViolations", () => {
  it("maps the API errors to code and detail", () => {
    expect(
      reviewViolations(
        apiClientError(
          [
            {
              code: "VIOLATION::ENTITY_EXISTS",
              status: "400",
              detail: "The review already exists.",
              source: { pointer: "/customerId" },
            },
            { code: "VIOLATION::TOO_SHORT_ERROR", detail: "Too short." },
          ],
          400,
        ),
      ),
    ).toEqual([
      {
        code: "VIOLATION::ENTITY_EXISTS",
        detail: "The review already exists.",
      },
      { code: "VIOLATION::TOO_SHORT_ERROR", detail: "Too short." },
    ]);
  });

  it("is null for an API error without errors and for other failures", () => {
    expect(reviewViolations(apiClientError([], 500))).toBeNull();
    expect(reviewViolations(new Error("offline"))).toBeNull();
  });
});
