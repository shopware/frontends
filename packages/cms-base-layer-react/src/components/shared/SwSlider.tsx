"use client";

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { CSSProperties, ReactNode, TouchEvent } from "react";

import { cx } from "../../helpers/cx";
import type { VerticalAlign } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export type SwSliderNavigation = "outside" | "inside" | "none" | "";

export type SwSliderDisplayMode = "standard" | "cover" | "contain";

export type SwSliderOptions = {
  autoplay?: boolean;
  autoSlideInterval?: number;
  loop?: boolean;
  navigationDots?: SwSliderNavigation;
  navigationArrows?: SwSliderNavigation;
  displayMode?: SwSliderDisplayMode;
  minHeight?: string | number;
  verticalAlign?: VerticalAlign;
  slidesToShow?: number;
  slidesToScroll?: number;
  gap?: string;
  ssrBreakpoints?: Record<string, number>;
};

export type SwSliderProps = SwSliderOptions & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const SLIDE_SPEED = 300;
const INIT_DELAY = 100;
const RESIZE_DEBOUNCE = 100;
const SWIPE_THRESHOLD = 50;

const ARROW_CLASS =
  "absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center";

type TrackItem = {
  key: string;
  index: number;
  node: ReactNode;
};

function buildTrackItems(slides: ReactNode[], cloneCount: number): TrackItem[] {
  const main = slides.map((node, index) => ({
    key: `slide-${index}`,
    index,
    node,
  }));
  if (cloneCount <= 0) return main;

  const count = slides.length;
  const before = slides.slice(count - cloneCount).map((node, offset) => ({
    key: `clone-start-${offset}`,
    index: offset - cloneCount,
    node,
  }));
  const after = slides.slice(0, cloneCount).map((node, offset) => ({
    key: `clone-end-${offset}`,
    index: count + offset,
    node,
  }));
  return [...before, ...main, ...after];
}

export function SwSlider({
  autoplay = false,
  autoSlideInterval = 3000,
  loop = true,
  navigationDots,
  navigationArrows,
  displayMode,
  minHeight,
  verticalAlign,
  slidesToShow: slidesToShowProp = 1,
  slidesToScroll: slidesToScrollProp = 1,
  gap = "0px",
  ssrBreakpoints,
  children,
  className,
  style,
}: SwSliderProps) {
  const sliderId = useId();
  const slides = Children.toArray(children);
  const count = slides.length;
  const slidesToShow = slidesToShowProp >= count ? count : slidesToShowProp;
  const slidesToScroll =
    slidesToScrollProp >= slidesToShow ? slidesToShow : slidesToScrollProp;
  const cloneCount = loop ? slidesToShow : 0;
  const trackItems = buildTrackItems(slides, cloneCount);
  const trackLength = trackItems.length;
  const visible = slidesToShow || 1;

  const displayModeValue = displayMode || "standard";
  const verticalAlignValue = verticalAlign || "flex-start";
  const navigationArrowsValue = navigationArrows || "none";
  const navigationDotsValue = navigationDots || "none";

  const imageSliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackStyle, setTrackStyle] = useState<CSSProperties | undefined>(
    undefined,
  );
  const trackStyleRef = useRef<CSSProperties | undefined>(undefined);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeRef = useRef(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const widthRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const isSlidingRef = useRef(false);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const timers = timersRef.current;
    const timer = setTimeout(() => {
      timers.delete(timer);
      fn();
    }, delay);
    timers.add(timer);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const applyTrackStyle = useCallback((next: CSSProperties) => {
    trackStyleRef.current = next;
    setTrackStyle(next);
  }, []);

  const setActive = useCallback((index: number) => {
    activeRef.current = index;
    setActiveSlideIndex(index);
  }, []);

  const buildTrackStyle = useCallback(
    (transformIndex: number, moving = false, callback?: () => void) => {
      const width = widthRef.current;
      let styleObj: CSSProperties = {
        transform: `translate3d(-${(transformIndex + cloneCount) * (width / visible)}px, 0px, 0px)`,
        width: `${trackLength * width}px`,
      };

      const currentHeight = trackStyleRef.current?.height;
      if (currentHeight) {
        styleObj.height = currentHeight;
      }

      if (moving) {
        styleObj = {
          ...styleObj,
          transition: `transform ${SLIDE_SPEED}ms ease 0s`,
        };
        applyTrackStyle({ ...styleObj });
        isSlidingRef.current = true;
        schedule(() => {
          const styleWithoutTransition = { ...styleObj };
          delete styleWithoutTransition.transition;
          applyTrackStyle(styleWithoutTransition);
          isSlidingRef.current = false;
          callback?.();
        }, SLIDE_SPEED);
      } else {
        applyTrackStyle({ ...styleObj });
      }

      schedule(() => {
        let height = "unset";
        if (displayModeValue === "cover") {
          height = "100%";
        } else if (displayModeValue === "standard") {
          const slide = trackRef.current?.children[transformIndex + cloneCount];
          height = slide?.children[0]?.children[0]?.clientHeight
            ? `${slide.clientHeight}px`
            : "auto";
        }
        styleObj = { ...styleObj, height };
        applyTrackStyle({ ...styleObj });
      }, 0);
    },
    [
      applyTrackStyle,
      cloneCount,
      displayModeValue,
      schedule,
      trackLength,
      visible,
    ],
  );

  const next = useCallback(() => {
    if (isSlidingRef.current || count === 0) return;
    if (!loop) {
      const last = Math.max(0, count - slidesToShow);
      const target = Math.min(activeRef.current + slidesToScroll, last);
      if (target === activeRef.current) return;
      setActive(target);
      buildTrackStyle(target, true);
      return;
    }
    const target = activeRef.current + slidesToScroll;
    setActive(target);
    buildTrackStyle(target, true, () => {
      if (activeRef.current >= count) {
        const reset = activeRef.current - count;
        setActive(reset);
        buildTrackStyle(reset);
      }
    });
  }, [buildTrackStyle, count, loop, setActive, slidesToScroll, slidesToShow]);

  const previous = useCallback(() => {
    if (isSlidingRef.current || count === 0) return;
    if (!loop) {
      const target = Math.max(activeRef.current - slidesToScroll, 0);
      if (target === activeRef.current) return;
      setActive(target);
      buildTrackStyle(target, true);
      return;
    }
    const target = activeRef.current - slidesToScroll;
    setActive(target);
    buildTrackStyle(target, true, () => {
      if (activeRef.current <= 0 - slidesToShow) {
        const reset = activeRef.current + count;
        setActive(reset);
        buildTrackStyle(reset);
      }
    });
  }, [buildTrackStyle, count, loop, setActive, slidesToScroll, slidesToShow]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isSlidingRef.current) return;
      if (activeRef.current === index) return;
      setActive(index);
      buildTrackStyle(index, true);
    },
    [buildTrackStyle, setActive],
  );

  useEffect(() => {
    if (!autoplay || !isReady) return;
    const interval = setInterval(next, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval, autoplay, isReady, next]);

  useEffect(() => {
    const imageSlider = imageSliderRef.current;
    if (!imageSlider) return;

    const measure = () => {
      const width = imageSlider.getBoundingClientRect().width;
      widthRef.current = width;
      setSliderWidth(width);
    };
    measure();

    const init = setTimeout(() => {
      measure();
      buildTrackStyle(activeRef.current);
      setIsReady(true);
    }, INIT_DELAY);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            measure();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              buildTrackStyle(activeRef.current);
            }, RESIZE_DEBOUNCE);
          });
    observer?.observe(imageSlider);

    return () => {
      clearTimeout(init);
      clearTimeout(resizeTimer);
      observer?.disconnect();
    };
  }, [buildTrackStyle]);

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

  const imageSliderStyle: CSSProperties =
    displayMode === "cover"
      ? { minHeight, margin: `0 -${gap}` }
      : { minHeight };

  const ssrTrackStyle: CSSProperties =
    trackLength === 0 || slidesToShow === 0 || ssrBreakpoints
      ? {}
      : {
          width: `${(trackLength / slidesToShow) * 100}%`,
          transform: `translateX(-${(cloneCount / trackLength) * 100}%)`,
        };

  let ssrCss: string | undefined;
  if (ssrBreakpoints && !trackStyle && trackLength > 0 && slidesToShow > 0) {
    const selector = `[data-ssr-slider="${sliderId}"]`;
    const transform = `translateX(-${(cloneCount / trackLength) * 100}%)`;
    ssrCss = `${selector}{width:${trackLength * 100}%;transform:${transform}}`;
    for (const [query, slidesVisible] of Object.entries(ssrBreakpoints)) {
      ssrCss += `@media ${query}{${selector}{width:${(trackLength / slidesVisible) * 100}%}}`;
    }
  }

  const slideWidth = sliderWidth
    ? `${sliderWidth / visible}px`
    : `${100 / (trackLength || 1)}%`;
  const slideHeight = displayModeValue === "standard" ? "min-content" : "100%";

  return (
    <div
      className={cx(
        "relative overflow-hidden h-full",
        navigationArrowsValue === "outside" && "px-10",
        navigationDotsValue === "outside" && "pb-15",
        className,
      )}
      style={style}
    >
      {ssrCss ? <style>{ssrCss}</style> : null}
      <div
        ref={imageSliderRef}
        className="overflow-hidden h-full"
        style={imageSliderStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          data-ssr-slider={ssrBreakpoints ? sliderId : undefined}
          className={cx(
            "flex",
            displayModeValue === "contain" &&
              verticalAlignValue === "center" &&
              "items-center",
            displayModeValue === "contain" &&
              verticalAlignValue === "flex-start" &&
              "items-start",
            displayModeValue === "contain" &&
              verticalAlignValue === "flex-end" &&
              "items-end",
          )}
          style={trackStyle ?? ssrTrackStyle}
        >
          {trackItems.map((item) => (
            <div
              key={item.key}
              data-index={item.index}
              style={{
                width: slideWidth,
                padding: `0 ${gap}`,
                height: slideHeight,
              }}
            >
              {item.node}
            </div>
          ))}
        </div>
      </div>
      <div className={navigationArrowsValue === "none" ? "hidden" : undefined}>
        <button
          type="button"
          aria-label="Previous slide"
          disabled={!loop && activeSlideIndex <= 0}
          className={cx(
            ARROW_CLASS,
            "left-4",
            navigationArrowsValue === "outside" &&
              "bg-brand-tertiary text-surface-on-surface",
            navigationArrowsValue === "inside" &&
              "transition bg-white/20 hover:bg-white/50",
          )}
          onClick={previous}
        >
          <ChevronLeftIcon className="h-6 w-6 transition-transform" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          disabled={
            !loop && activeSlideIndex >= Math.max(0, count - slidesToShow)
          }
          className={cx(
            ARROW_CLASS,
            "right-4",
            navigationArrowsValue === "outside" &&
              "bg-brand-tertiary text-surface-on-surface",
            navigationArrowsValue === "inside" &&
              "transition bg-white/20 hover:bg-white/50",
          )}
          onClick={next}
        >
          <ChevronRightIcon className="h-6 w-6 transition-transform" />
        </button>
      </div>
      <div
        className={cx(
          "absolute bottom-5 left-1/2 transform -translate-x-1/2 gap-2 items-center",
          navigationDotsValue !== "none" ? "flex" : "hidden",
        )}
      >
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={cx(
              "rounded-full cursor-pointer transition-all duration-300",
              index === activeSlideIndex
                ? "w-6 h-2 bg-surface-on-surface-variant"
                : "w-2 h-2 bg-surface-surface-container-highest",
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
