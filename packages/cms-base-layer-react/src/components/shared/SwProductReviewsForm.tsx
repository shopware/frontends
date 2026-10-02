"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsReviewResult } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ExclamationCircleIcon, ReviewStarIcon, SpinnerIcon } from "../icons";
import { BaseButton } from "../ui/BaseButton";

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

const TITLE_MIN_LENGTH = 5;
const REVIEW_MIN_LENGTH = 40;
const REVIEW_ALREADY_EXISTS_CODE = "VIOLATION::ENTITY_EXISTS";
const REQUIRED_MESSAGE = "Value is required";
const STAR_VALUES = [1, 2, 3, 4, 5];
const STAR_CLASS =
  "cursor-pointer hover:opacity-80 transition-opacity active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-brand-primary rounded text-surface-on-surface-variant";
const INPUT_CLASS =
  "block w-full px-3 py-2.5 md:py-2 border rounded-md text-base md:text-sm text-surface-on-surface bg-surface-surface placeholder:text-surface-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-outline-outline";

type Field = "rating" | "title" | "review";

type Touched = Record<Field, boolean>;

const UNTOUCHED: Touched = { rating: false, title: false, review: false };
const ALL_TOUCHED: Touched = { rating: true, title: true, review: true };

function minLengthMessage(min: number): string {
  return `This field should be at least ${min} characters long`;
}

function validateText(value: string, minLength: number): string | undefined {
  if (!value.trim().length) return REQUIRED_MESSAGE;
  if (value.length < minLength) return minLengthMessage(minLength);
  return undefined;
}

function validateRating(value: number | null): string | undefined {
  return value === null ? REQUIRED_MESSAGE : undefined;
}

export function SwProductReviewsForm({
  productId,
  translations,
  onSuccess,
}: SwProductReviewsFormProps) {
  const t = withTranslationDefaults(translations, translationDefaults);
  const actions = useCmsActions();

  const [rating, setRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [touched, setTouched] = useState<Touched>(UNTOUCHED);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const errors: Record<Field, string | undefined> = {
    rating: validateRating(rating),
    title: validateText(title, TITLE_MIN_LENGTH),
    review: validateText(review, REVIEW_MIN_LENGTH),
  };

  function visibleError(field: Field): string | undefined {
    return touched[field] ? errors[field] : undefined;
  }

  function touch(field: Field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function resolveErrorMessages(result: CmsReviewResult): string[] {
    const violations =
      result.violations ?? (result.message ? [{ detail: result.message }] : []);
    return violations.flatMap(({ code, detail }) => {
      const message =
        (code ? t.errors[code] : undefined) ??
        (code === REVIEW_ALREADY_EXISTS_CODE
          ? t.product.errors.reviewAlreadyExists
          : undefined) ??
        detail;
      return message ? [message] : [];
    });
  }

  async function submit() {
    setTouched(ALL_TOUCHED);
    if (errors.rating || errors.title || errors.review) return;

    setIsLoading(true);
    const result = await actions
      .submitProductReview({
        productId,
        title,
        content: review,
        points: rating ?? 0,
      })
      .catch(() => null);
    setIsLoading(false);
    if (!result) return;
    if (!result.ok) {
      setErrorMessages(resolveErrorMessages(result));
      return;
    }
    setRating(null);
    setTitle("");
    setReview("");
    setTouched(UNTOUCHED);
    setErrorMessages([]);
    onSuccess?.();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  const currentRating = rating ?? 0;
  const ratingError = visibleError("rating");
  const titleError = visibleError("title");
  const reviewError = visibleError("review");

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
          >
            {STAR_VALUES.map((value) => {
              const filled = value <= currentRating;
              return (
                <button
                  key={`star-${value}`}
                  type="button"
                  aria-label={`Rate ${value} out of 5 stars`}
                  className={STAR_CLASS}
                  data-testid={
                    filled ? "review-filled-star" : "review-empty-star"
                  }
                  onClick={() => setRating(value)}
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
          {ratingError ? (
            <span className="pt-1 text-sm text-states-error">
              {ratingError}
            </span>
          ) : null}
        </div>
      </div>
      {errorMessages.length ? (
        <div className="p-3 mb-4 bg-surface-surface-container border border-states-error rounded-md flex gap-2 md:gap-3 items-start">
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
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-surface-on-surface"
        >
          {t.product.reviewsForm.title}
        </label>
        <input
          id="title"
          value={title}
          className={cx(
            INPUT_CLASS,
            titleError
              ? "border-states-error focus:ring-states-error"
              : "border-outline-outline",
          )}
          type="text"
          placeholder={t.product.reviewsForm.titlePlaceholder}
          disabled={isLoading}
          data-testid="review-title-input"
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => touch("title")}
        />
        {titleError ? (
          <span className="pt-1 text-sm text-states-error">{titleError}</span>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="review"
          className="block mb-2 text-sm font-medium text-surface-on-surface"
        >
          {t.product.reviewsForm.review}
        </label>
        <textarea
          id="review"
          value={review}
          className={cx(
            INPUT_CLASS,
            "min-h-32 md:min-h-40",
            reviewError
              ? "border-states-error focus:ring-states-error"
              : "border-outline-outline",
          )}
          placeholder={t.product.reviewsForm.reviewPlaceholder}
          disabled={isLoading}
          data-testid="review-text-input"
          onChange={(event) => setReview(event.target.value)}
          onBlur={() => touch("review")}
        />
        {reviewError ? (
          <span className="pt-1 text-sm text-states-error">{reviewError}</span>
        ) : null}
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
