import { getTranslatedProperty } from "@shopware/helpers";

import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import { sanitizeHtml } from "../../rich-text/sanitize";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import type { CmsElementProductDescriptionReviews as CmsElementProductDescriptionReviewsContent } from "../../types";
import { SwProductReviews } from "../shared/SwProductReviews";
import { CmsElementProductDescriptionReviewsTabs } from "./CmsElementProductDescriptionReviewsTabs";

const translationDefaults = {
  product: {
    description: "Description",
    reviews: "Reviews",
    messages: {
      reviewAdded: "Thank you for submitting your review",
      loginToReview: "Please log in to write a review",
    },
  },
  errors: {} as CmsTranslations,
};

export function CmsElementProductDescriptionReviews({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementProductDescriptionReviewsContent>) {
  const product = content.data?.product ?? ctx.product;
  const reviewsEnabled = content.data?.reviews != null;
  const reviews = content.data?.reviews?.elements ?? [];
  const description = sanitizeHtml(
    getTranslatedProperty(product, "description"),
  );
  const translations = withTranslationDefaults(
    ctx.translations,
    translationDefaults,
  );

  return (
    <div
      className={cx(
        "w-full self-stretch inline-flex flex-col justify-start items-start gap-4",
        className,
      )}
      style={style}
    >
      <CmsElementProductDescriptionReviewsTabs
        productId={product?.id}
        reviewsProductId={
          reviewsEnabled && product
            ? (product.parentId ?? product.id)
            : undefined
        }
        initialReviewCount={reviews.length}
        isLoggedIn={ctx.isLoggedIn}
        locale={ctx.locale}
        translations={{
          product: translations.product,
          errors: translations.errors,
        }}
        description={
          <div
            className="cms-element-text"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        }
        reviews={
          product ? (
            <SwProductReviews
              reviews={reviews}
              locale={ctx.locale}
              translations={ctx.translations}
            />
          ) : null
        }
        categories={
          product?.categories ? (
            <div>
              {product.categories.map((category) => (
                <div key={category.id} className="mb-2">
                  {getTranslatedProperty(category, "name")}
                </div>
              ))}
            </div>
          ) : (
            <div>No categories available</div>
          )
        }
      />
    </div>
  );
}
