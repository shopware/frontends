import { describe, expect, it } from "vitest";

import type { Schemas } from "#shopware";

import { renderToHtml } from "../../__fixtures__/render";
import { SwProductReviews } from "./SwProductReviews";

function review(
  overrides: Partial<Schemas["ProductReview"]> = {},
): Schemas["ProductReview"] {
  return {
    id: "review-1",
    productId: "product-1",
    salesChannelId: "sales-channel-1",
    languageId: "language-1",
    title: "Solid chair",
    content: "Sturdy and comfortable for long working days at the desk.",
    points: 4,
    status: true,
    createdAt: "2026-10-01T10:00:00.000Z",
    ...overrides,
  };
}

describe("SwProductReviews", () => {
  it("formats the date with the given locale", async () => {
    const createdAt = "2026-10-01T10:00:00.000Z";
    const html = await renderToHtml(
      <SwProductReviews reviews={[review({ createdAt })]} locale="de-DE" />,
    );

    const expected = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(createdAt));
    expect(html).toContain(expected);
  });

  it("marks only reviews that are not approved yet", async () => {
    const html = await renderToHtml(
      <SwProductReviews
        reviews={[review(), review({ id: "review-2", status: false })]}
        locale="en-GB"
      />,
    );

    expect(html.match(/Your review has not been approved yet/g)).toHaveLength(
      1,
    );
  });

  it("uses the given translations over its English defaults", async () => {
    const html = await renderToHtml(
      <SwProductReviews
        reviews={[review({ status: false, comment: "Thanks!" })]}
        locale="pl-PL"
        translations={{
          product: {
            reviewNotAccepted: "Twoja opinia nie została jeszcze zatwierdzona",
            reviewFeedback: "Odpowiedź sklepu",
          },
        }}
      />,
    );

    expect(html).toContain("Twoja opinia nie została jeszcze zatwierdzona");
    expect(html).toContain("Odpowiedź sklepu");
    expect(html).toContain("Thanks!");
  });

  it("says that there are no reviews yet", async () => {
    const html = await renderToHtml(
      <SwProductReviews reviews={[]} locale="en-GB" />,
    );

    expect(html).toContain("No reviews yet.");
  });
});
