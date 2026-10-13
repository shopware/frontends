"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, TransitionEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsCustomerState } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { useProductReviewList } from "../../reviews/useProductReviewList";
import type { CmsTranslations } from "../../translations";
import { CheckCircleIcon, ChevronDownIcon, UserIcon } from "../icons";
import { SwProductReviews } from "../shared/SwProductReviews";
import { SwProductReviewsForm } from "../shared/SwProductReviewsForm";

export type CmsElementProductDescriptionReviewsTabsTranslations = {
  product: {
    description: string;
    reviews: string;
    messages: {
      reviewAdded: string;
      loginToReview: string;
    };
  } & CmsTranslations;
  errors: CmsTranslations;
};

export type CmsElementProductDescriptionReviewsTabsProps = {
  productId?: string;
  reviewsProductId?: string;
  initialReviewCount: number;
  isLoggedIn: boolean;
  locale: string;
  translations: CmsElementProductDescriptionReviewsTabsTranslations;
  description: ReactNode;
  reviews: ReactNode;
  categories: ReactNode;
};

const DESCRIPTION_SECTION = 1;
const REVIEWS_SECTION = 2;
const CATEGORY_SECTION = 3;

const CONTEXT_CUSTOMER_ID = "cms-context-customer";

function customerFromContext(isLoggedIn: boolean): CmsCustomerState {
  return isLoggedIn
    ? { status: "customer", customerId: CONTEXT_CUSTOMER_ID }
    : { status: "guest" };
}

function focusIfFocusWasLost(element: HTMLElement | null) {
  if (!element) return;
  const { activeElement, body } = element.ownerDocument;
  if (!activeElement || activeElement === body) element.focus();
}

type SectionToggleProps = {
  title: string;
  open: boolean;
  testId?: string;
  onToggle: () => void;
};

function SectionToggle({ title, open, testId, onToggle }: SectionToggleProps) {
  return (
    <div className="self-stretch flex flex-col justify-center items-center">
      <button
        type="button"
        className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1 cursor-pointer hover:bg-surface-surface-variant transition-colors text-left"
        aria-expanded={open}
        aria-label={title}
        data-testid={testId}
        onClick={onToggle}
      >
        <div className="flex-1 flex items-center gap-2.5">
          <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal">
            {title}
          </div>
        </div>
        <div className="w-6 h-6 relative">
          <div className="w-2.5 h-1.5 left-[7px] top-[9.50px] absolute">
            <ChevronDownIcon
              className={cx(
                "transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </div>
      </button>
    </div>
  );
}

type PanelPhase = "closed" | "opening" | "open" | "closing";

const PANEL_MAX_HEIGHT = "500px";
const PANEL_MOTION = "overflow-hidden transition-all duration-300 ease-in-out";

const panelPhaseClasses: Record<Exclude<PanelPhase, "closed">, string> = {
  opening: `${PANEL_MOTION} max-h-[500px] opacity-100 translate-y-0 starting:max-h-0 starting:opacity-0 starting:-translate-y-2.5`,
  open: "",
  closing: `${PANEL_MOTION} max-h-0 opacity-0 -translate-y-2.5`,
};

function SectionPanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<PanelPhase>(open ? "open" : "closed");

  if (open && phase !== "open" && phase !== "opening") {
    setPhase("opening");
  }
  if (!open && (phase === "open" || phase === "opening")) {
    setPhase("closing");
  }

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (phase !== "closing" || !panel) return;
    panel.style.maxHeight = PANEL_MAX_HEIGHT;
    void panel.offsetHeight;
    panel.style.maxHeight = "";
  }, [phase]);

  if (phase === "closed") return null;

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (phase === "opening") setPhase("open");
    if (phase === "closing") setPhase("closed");
  }

  return (
    <div
      ref={panelRef}
      className={cx(
        "self-stretch flex flex-col justify-center items-center gap-2.5",
        panelPhaseClasses[phase],
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="self-stretch text-surface-on-surface text-base font-normal leading-normal">
        {children}
      </div>
    </div>
  );
}

export function CmsElementProductDescriptionReviewsTabs({
  productId,
  reviewsProductId,
  initialReviewCount,
  isLoggedIn,
  locale,
  translations,
  description,
  reviews,
  categories,
}: CmsElementProductDescriptionReviewsTabsProps) {
  const actions = useCmsActions();
  const [openSections, setOpenSections] = useState<ReadonlySet<number>>(
    () => new Set([DESCRIPTION_SECTION]),
  );
  const [reviewAddedFor, setReviewAddedFor] = useState<string | null>(null);
  const trackedCustomer = actions.getCustomerState();
  const customer = trackedCustomer ?? customerFromContext(isLoggedIn);
  const customerId =
    customer.status === "customer" ? customer.customerId : null;
  const reviewAdded = customerId !== null && reviewAddedFor === customerId;
  const [previousCustomerId, setPreviousCustomerId] = useState(customerId);
  const [customerLeft, setCustomerLeft] = useState(false);
  if (previousCustomerId !== customerId) {
    setPreviousCustomerId(customerId);
    setCustomerLeft(previousCustomerId !== null && customerId === null);
  }
  const reviewsOpen = openSections.has(REVIEWS_SECTION);
  const list = useProductReviewList({
    productId: reviewsProductId,
    customerId: trackedCustomer ? customerId : null,
    open: reviewsOpen,
  });

  function toggleSection(section: number) {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }

  function isSectionOpen(section: number): boolean {
    return openSections.has(section);
  }

  function handleReviewAdded() {
    setReviewAddedFor(customerId);
    void list.reload();
  }

  return (
    <>
      <SectionToggle
        title={translations.product.description}
        open={isSectionOpen(DESCRIPTION_SECTION)}
        onToggle={() => toggleSection(DESCRIPTION_SECTION)}
      />
      <SectionPanel open={isSectionOpen(DESCRIPTION_SECTION)}>
        {description}
      </SectionPanel>
      <SectionToggle
        title={`${translations.product.reviews} (${list.reviews?.length ?? initialReviewCount})`}
        open={reviewsOpen}
        testId="product-reviews-tab"
        onToggle={() => toggleSection(REVIEWS_SECTION)}
      />
      <SectionPanel open={reviewsOpen}>
        <div aria-busy={list.loading || undefined}>
          {list.reviews ? (
            <SwProductReviews
              reviews={list.reviews}
              locale={locale}
              translations={translations}
            />
          ) : (
            reviews
          )}
        </div>
        {productId && customerId && !reviewAdded ? (
          <SwProductReviewsForm
            key={customerId}
            productId={productId}
            translations={translations}
            onSuccess={handleReviewAdded}
          />
        ) : null}
        {productId && customer.status === "guest" ? (
          <div
            ref={customerLeft ? focusIfFocusWasLost : undefined}
            tabIndex={-1}
            className="mt-4 p-3 bg-surface-surface-container border border-surface-on-surface-variant rounded-md flex gap-2 md:gap-3 items-center"
          >
            <div className="w-5 h-5 text-surface-on-surface-variant flex-shrink-0">
              <UserIcon width={20} height={20} aria-label="User" />
            </div>
            <span className="text-sm text-surface-on-surface-variant">
              {translations.product.messages.loginToReview}
            </span>
          </div>
        ) : null}
        {reviewAdded ? (
          <div
            ref={focusIfFocusWasLost}
            tabIndex={-1}
            className="mt-4 p-3 bg-surface-surface-container border border-states-success rounded-md flex gap-2 md:gap-3 items-center"
          >
            <div className="w-5 h-5 text-states-success flex-shrink-0">
              <CheckCircleIcon width={20} height={20} aria-label="Success" />
            </div>
            <span className="text-sm text-states-success">
              {translations.product.messages.reviewAdded}
            </span>
          </div>
        ) : null}
      </SectionPanel>
      <SectionToggle
        title="Category"
        open={isSectionOpen(CATEGORY_SECTION)}
        onToggle={() => toggleSection(CATEGORY_SECTION)}
      />
      <SectionPanel open={isSectionOpen(CATEGORY_SECTION)}>
        {categories}
      </SectionPanel>
    </>
  );
}
