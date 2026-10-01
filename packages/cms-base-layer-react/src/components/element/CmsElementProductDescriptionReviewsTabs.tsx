"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, TransitionEvent } from "react";

import { cx } from "../../helpers/cx";
import type { CmsTranslations } from "../../translations";
import { CheckCircleIcon, ChevronDownIcon, UserIcon } from "../icons";
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
  reviewCount: number;
  isLoggedIn: boolean;
  translations: CmsElementProductDescriptionReviewsTabsTranslations;
  description: ReactNode;
  reviews: ReactNode;
  categories: ReactNode;
};

const DESCRIPTION_SECTION = 1;
const REVIEWS_SECTION = 2;
const CATEGORY_SECTION = 3;

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
  reviewCount,
  isLoggedIn,
  translations,
  description,
  reviews,
  categories,
}: CmsElementProductDescriptionReviewsTabsProps) {
  const [openSections, setOpenSections] = useState<ReadonlySet<number>>(
    () => new Set([DESCRIPTION_SECTION]),
  );
  const [reviewAdded, setReviewAdded] = useState(false);

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
        title={`${translations.product.reviews} (${reviewCount})`}
        open={isSectionOpen(REVIEWS_SECTION)}
        testId="product-reviews-tab"
        onToggle={() => toggleSection(REVIEWS_SECTION)}
      />
      <SectionPanel open={isSectionOpen(REVIEWS_SECTION)}>
        {reviews}
        {productId && isLoggedIn && !reviewAdded ? (
          <SwProductReviewsForm
            productId={productId}
            translations={translations}
            onSuccess={() => setReviewAdded(true)}
          />
        ) : null}
        {productId && !isLoggedIn ? (
          <div className="mt-4 p-3 bg-surface-surface-container border border-surface-on-surface-variant rounded-md flex gap-2 md:gap-3 items-center">
            <div className="w-5 h-5 text-surface-on-surface-variant flex-shrink-0">
              <UserIcon width={20} height={20} aria-label="User" />
            </div>
            <span className="text-sm text-surface-on-surface-variant">
              {translations.product.messages.loginToReview}
            </span>
          </div>
        ) : null}
        {reviewAdded ? (
          <div className="mt-4 p-3 bg-surface-surface-container border border-states-success rounded-md flex gap-2 md:gap-3 items-center">
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
