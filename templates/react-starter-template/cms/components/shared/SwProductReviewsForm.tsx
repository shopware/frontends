"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsReviewResult } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ExclamationCircleIcon, ReviewStarIcon, SpinnerIcon } from "../icons";
import { BaseButton } from "../ui/BaseButton";
import { getActionFailureMessages } from "./actionNotifications";
import { FormError } from "./formParts";
import { fieldAria, fieldErrorId, minLength, required } from "./formValidation";
import type { FormRules } from "./formValidation";
import { useFormValidation } from "./useFormValidation";

export type SwProductReviewsFormProps = {
  productId: string;
  translations?: CmsTranslations;
  onSuccess?: () => void;
};

type ReviewsFormTranslations = {
  product: {
    addReview: string;
    reviewsForm: {
      title: string;
      titlePlaceholder: string;
      review: string;
      reviewPlaceholder: string;
      submit: string;
      rating: string;
    };
    errors: {
      reviewAlreadyExists: string;
    };
  };
  errors: Record<string, string>;
};

const translationDefaults: ReviewsFormTranslations = {
  product: {
    addReview: "Add review",
    reviewsForm: {
      title: "Title",
      titlePlaceholder: "Enter a title for your review",
      review: "Your review",
      reviewPlaceholder:
        "Share your experience with this product (minimum 40 characters)",
      submit: "Submit",
      rating: "Your rating",
    },
    errors: {
      reviewAlreadyExists:
        "You have already submitted a review for this product",
    },
  },
  errors: {},
};

const REVIEW_ALREADY_EXISTS_CODE = "VIOLATION::ENTITY_EXISTS";
const STAR_VALUES = [1, 2, 3, 4, 5];
const STAR_CLASS =
  "cursor-pointer hover:opacity-80 transition-opacity active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-brand-primary rounded text-surface-on-surface-variant";
const INPUT_CLASS =
  "block w-full px-3 py-2.5 md:py-2 border rounded-md text-base md:text-sm text-surface-on-surface bg-surface-surface placeholder:text-surface-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-outline-outline";

const ERROR_CLASS = "pt-1 text-sm text-states-error";

type ReviewValues = { rating: number | null; title: string; review: string };

const INITIAL_VALUES: ReviewValues = { rating: null, title: "", review: "" };

const RULES: FormRules<ReviewValues> = {
  rating: [required],
  title: [required, minLength(5)],
  review: [required, minLength(40)],
};

export function SwProductReviewsForm({
  productId,
  translations,
  onSuccess,
}: SwProductReviewsFormProps) {
  const t = withTranslationDefaults(translations, translationDefaults);
  const actions = useCmsActions();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { field, validateAll, reset } = useFormValidation(values, RULES);

  const patch = (changes: Partial<ReviewValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  function resolveErrorMessages(result: CmsReviewResult): string[] {
    const messages = (result.violations ?? []).flatMap(({ code, detail }) => {
      const message =
        (code ? t.errors[code] : undefined) ??
        (code === REVIEW_ALREADY_EXISTS_CODE
          ? t.product.errors.reviewAlreadyExists
          : undefined) ??
        detail;
      return message ? [message] : [];
    });
    return messages.length
      ? messages
      : getActionFailureMessages(result, { messages: t.errors });
  }

  async function submit() {
    if (isLoading || !validateAll()) return;
    setIsLoading(true);
    let result: CmsReviewResult;
    try {
      result = await actions.submitProductReview({
        productId,
        title: values.title,
        content: values.review,
        points: values.rating ?? 0,
      });
    } catch (error) {
      console.error("[CMS] action failed", error);
      setErrorMessages(getActionFailureMessages({}));
      return;
    } finally {
      setIsLoading(false);
    }
    if (!result.ok) {
      setErrorMessages(resolveErrorMessages(result));
      return;
    }
    setValues(INITIAL_VALUES);
    reset();
    setErrorMessages([]);
    onSuccess?.();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  const ratingId = useId();
  const titleId = useId();
  const reviewId = useId();
  const currentRating = values.rating ?? 0;
  const { ref: ratingRef, error: ratingError } = field("rating");
  const { ref: titleRef, ...titleField } = field("title");
  const { ref: reviewRef, ...reviewField } = field("review");

  return (
    <form className="flex flex-col gap-4 md:gap-5 relative" onSubmit={onSubmit}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface-surface/80 rounded-md">
          <SpinnerIcon className="h-12 w-12 animate-spin text-brand-primary" />
        </div>
      ) : null}
      <div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg md:text-xl font-bold text-surface-on-surface mt-3">
            {t.product.addReview}
          </h4>
          <span className="text-sm text-surface-on-surface-variant">
            {t.product.reviewsForm.rating}
          </span>
          <div
            className="flex flex-row gap-2"
            role="group"
            aria-label={t.product.reviewsForm.rating}
            aria-describedby={ratingError ? fieldErrorId(ratingId) : undefined}
          >
            {STAR_VALUES.map((value) => {
              const filled = value <= currentRating;
              return (
                <button
                  key={`star-${value}`}
                  ref={value === 1 ? ratingRef : undefined}
                  type="button"
                  aria-pressed={value === currentRating}
                  aria-label={`Rate ${value} out of 5 stars`}
                  className={STAR_CLASS}
                  data-testid={
                    filled ? "review-filled-star" : "review-empty-star"
                  }
                  onClick={() => patch({ rating: value })}
                >
                  <ReviewStarIcon
                    filled={filled}
                    width={24}
                    height={24}
                    className="block"
                  />
                </button>
              );
            })}
          </div>
          <FormError
            id={ratingId}
            error={ratingError}
            className={ERROR_CLASS}
          />
        </div>
      </div>
      {errorMessages.length ? (
        <div
          role="alert"
          className="p-3 mb-4 bg-surface-surface-container border border-states-error rounded-md flex gap-2 md:gap-3 items-start"
        >
          <div className="w-5 h-5 text-states-error flex-shrink-0 mt-0.5">
            <ExclamationCircleIcon width={20} height={20} aria-label="Error" />
          </div>
          <div className="flex-1">
            {errorMessages.map((message, index) => (
              <p
                key={`${index}-${message}`}
                className="text-sm text-states-error"
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <label
          htmlFor={titleId}
          className="block mb-2 text-sm font-medium text-surface-on-surface"
        >
          {t.product.reviewsForm.title}
        </label>
        <input
          {...fieldAria(titleId, titleField)}
          id={titleId}
          ref={titleRef}
          value={values.title}
          className={cx(
            INPUT_CLASS,
            titleField.error
              ? "border-states-error focus:ring-states-error"
              : "border-outline-outline",
          )}
          type="text"
          placeholder={t.product.reviewsForm.titlePlaceholder}
          disabled={isLoading}
          data-testid="review-title-input"
          onChange={(event) => patch({ title: event.target.value })}
          onBlur={titleField.onBlur}
        />
        <FormError
          id={titleId}
          error={titleField.error}
          className={ERROR_CLASS}
        />
      </div>
      <div>
        <label
          htmlFor={reviewId}
          className="block mb-2 text-sm font-medium text-surface-on-surface"
        >
          {t.product.reviewsForm.review}
        </label>
        <textarea
          {...fieldAria(reviewId, reviewField)}
          id={reviewId}
          ref={reviewRef}
          value={values.review}
          className={cx(
            INPUT_CLASS,
            "min-h-32 md:min-h-40",
            reviewField.error
              ? "border-states-error focus:ring-states-error"
              : "border-outline-outline",
          )}
          placeholder={t.product.reviewsForm.reviewPlaceholder}
          disabled={isLoading}
          data-testid="review-text-input"
          onChange={(event) => patch({ review: event.target.value })}
          onBlur={reviewField.onBlur}
        />
        <FormError
          id={reviewId}
          error={reviewField.error}
          className={ERROR_CLASS}
        />
      </div>
      <BaseButton
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading}
        loading={isLoading}
        className="mt-4 w-full md:w-auto md:self-start"
        data-testid="review-submit-button"
      >
        {t.product.reviewsForm.submit}
      </BaseButton>
    </form>
  );
}
