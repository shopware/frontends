import type { Schemas } from "#shopware";

import type { CmsClientContext } from "../../context";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import { WarningIcon } from "../icons";
import { SwProductRating } from "./SwProductRating";

export type SwProductReviewsProps = {
  reviews?: Schemas["ProductReview"][];
  ctx: CmsClientContext;
};

const translationDefaults = {
  product: {
    noReviews: "No reviews yet.",
    reviewNotAccepted: "Your review has not been approved yet",
    reviewFeedback: "Shop feedback",
  },
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

function formatDate(date: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, DATE_FORMAT).format(new Date(date));
  } catch {
    return date;
  }
}

export function SwProductReviews({ reviews = [], ctx }: SwProductReviewsProps) {
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );

  if (!reviews.length) {
    return <div>{translations.product.noReviews}.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review, index) => (
        <div
          key={review.id ?? index}
          className={cx(
            "pb-6",
            index < reviews.length - 1 &&
              "border-b border-surface-surface-container-highest",
          )}
        >
          {review.createdAt ? (
            <div className="cms-block-product-description-reviews__reviews-time text-surface-on-surface-variant text-sm">
              {review.externalUser ? (
                <span>{review.externalUser} - </span>
              ) : null}
              <span>{formatDate(review.createdAt, ctx.locale)}</span>
            </div>
          ) : null}
          {!review.status ? (
            <div className="mt-2 text-xs p-2 bg-states-info-container text-states-on-info-container flex gap-2 items-center">
              <WarningIcon className="w-6 h-6" />
              {translations.product.reviewNotAccepted}
            </div>
          ) : null}
          <div className="cms-block-product-description-reviews__reviews-rating inline-flex items-center mt-2">
            <SwProductRating
              rating={review.points ?? 0}
              starSize={20}
              showCount={false}
            />
            <div className="cms-block-product-description-reviews__reviews-title font-semibold ml-2">
              <p>{review.title}</p>
            </div>
          </div>
          <div className="cms-block-product-description-reviews__reviews-content mt-2">
            <p className="break-words">{review.content}</p>
            {review.comment ? (
              <p className="text-surface-on-surface-variant mt-2">
                - {translations.product.reviewFeedback}: {review.comment}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
