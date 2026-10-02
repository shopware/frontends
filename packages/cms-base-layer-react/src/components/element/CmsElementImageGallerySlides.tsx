"use client";

import { Children, useRef, useState } from "react";
import type { ReactNode, TouchEvent } from "react";

import { cx } from "../../helpers/cx";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export type CmsElementImageGalleryNavigation =
  | "outside"
  | "inside"
  | "none"
  | "";

export type CmsElementImageGallerySlidesProps = {
  children?: ReactNode;
  minHeight?: string | number;
  navigationArrows?: CmsElementImageGalleryNavigation;
  navigationDots?: CmsElementImageGalleryNavigation;
};

const SWIPE_THRESHOLD = 50;

const ARROW_CLASS =
  "w-10 h-10 rounded-full transition disabled:opacity-50 pointer-events-auto shadow-lg flex items-center justify-center";

export function CmsElementImageGallerySlides({
  children,
  minHeight,
  navigationArrows,
  navigationDots,
}: CmsElementImageGallerySlidesProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const navigationArrowsValue = navigationArrows || "inside";
  const navigationDotsValue = navigationDots || "inside";

  function goToSlide(index: number) {
    if (index >= 0 && index < count) {
      setCurrentIndex(index);
    }
  }

  function previous() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function next() {
    if (currentIndex < count - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX || 0;
    touchEndX.current = 0;
  }

  function onTouchMove(event: TouchEvent<HTMLDivElement>) {
    touchEndX.current = event.touches[0]?.clientX || 0;
  }

  function onTouchEnd() {
    if (touchEndX.current) {
      const deltaX = touchEndX.current - touchStartX.current;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          next();
        } else {
          previous();
        }
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  }

  const arrowClass = cx(
    ARROW_CLASS,
    navigationArrowsValue === "outside"
      ? "bg-brand-tertiary text-surface-on-surface"
      : "bg-surface-surface/20 hover:bg-surface-surface/50",
  );

  return (
    <>
      <div
        className="w-full relative overflow-hidden"
        style={{ minHeight }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={currentIndex}
          className="absolute inset-0 transition-all duration-300 ease-in-out starting:opacity-0 starting:scale-105 starting:translate-y-[10px]"
        >
          {slides[currentIndex] ?? null}
        </div>
      </div>

      {count > 1 && navigationArrowsValue !== "none" ? (
        <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
          <button
            type="button"
            className={arrowClass}
            disabled={currentIndex === 0}
            aria-label="Previous image"
            onClick={previous}
          >
            <ChevronLeftIcon className="h-6 w-6 transition-transform" />
          </button>
          <button
            type="button"
            className={arrowClass}
            disabled={currentIndex === count - 1}
            aria-label="Next image"
            onClick={next}
          >
            <ChevronRightIcon className="h-6 w-6 transition-transform" />
          </button>
        </div>
      ) : null}

      {count > 1 && navigationDotsValue !== "none" ? (
        <div
          className={cx(
            "flex justify-center items-center gap-2",
            navigationDotsValue === "outside"
              ? "mt-4"
              : "absolute bottom-4 left-1/2 transform -translate-x-1/2",
          )}
        >
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={cx(
                "relative rounded-full transition-all duration-200 hover:scale-110",
                index === currentIndex
                  ? "w-6 h-2 bg-surface-on-surface-variant"
                  : "w-2 h-2 bg-surface-surface-container-highest",
              )}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
