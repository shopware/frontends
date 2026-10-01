"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { ChevronDownIcon } from "../icons";
import type {
  ListingFilter,
  ListingFilterChangeEvent,
  ListingFilterDisplayMode,
} from "./listingFilterTypes";

export type SwFilterPriceProps = {
  filter: ListingFilter;
  selectedFilters: { price?: { min?: number; max?: number } };
  displayMode?: ListingFilterDisplayMode;
  translations?: CmsTranslations;
  onSelectValue: (event: ListingFilterChangeEvent) => void;
};

const defaultTranslations = {
  listing: {
    min: "Min",
    max: "Max",
  },
};

const DEBOUNCE_MS = 500;

type Prices = { min: number; max: number };
type DragType = "min" | "max" | null;

const getClientX = (event: MouseEvent | TouchEvent): number =>
  event instanceof MouseEvent
    ? event.clientX
    : (event.touches.item(0)?.clientX ?? 0);

const toInputNumber = (event: ChangeEvent<HTMLInputElement>): number => {
  const parsed = event.target.valueAsNumber;
  return Number.isFinite(parsed) ? parsed : 0;
};

const getKeyStep = (key: string): number => {
  if (key === "ArrowRight" || key === "ArrowUp") return 1;
  if (key === "ArrowLeft" || key === "ArrowDown") return -1;
  return 0;
};

export function SwFilterPrice({
  filter,
  selectedFilters,
  displayMode = "accordion",
  translations,
  onSelectValue,
}: SwFilterPriceProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const selectedMin = selectedFilters.price?.min;
  const selectedMax = selectedFilters.price?.max;
  const initialPrices = (): Prices => ({
    min: Math.floor(selectedMin ?? filter.min ?? 0),
    max: Math.floor(selectedMax ?? filter.max ?? 0),
  });

  const [prices, setPrices] = useState<Prices>(initialPrices);
  const syncKey = `${selectedMin}|${selectedMax}|${filter.min}|${filter.max}`;
  const [previousSyncKey, setPreviousSyncKey] = useState(syncKey);
  if (previousSyncKey !== syncKey) {
    setPreviousSyncKey(syncKey);
    setPrices(initialPrices());
  }

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggle = () => setIsFilterVisible((visible) => !visible);

  const onSelectValueRef = useRef(onSelectValue);
  useEffect(() => {
    onSelectValueRef.current = onSelectValue;
  });

  const pricesRef = useRef(prices);
  const emitRange = useCallback(() => {
    const { min, max } = pricesRef.current;
    onSelectValueRef.current({ code: "price", value: { min, max } });
  }, []);

  const timer = useRef<number | undefined>(undefined);
  const clearPendingEmit = () => window.clearTimeout(timer.current);
  const scheduleEmit = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(emitRange, DEBOUNCE_MS);
  }, [emitRange]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const userChanged = useRef(false);
  const previousPrices = useRef(prices);
  useEffect(() => {
    const previous = previousPrices.current;
    previousPrices.current = prices;
    pricesRef.current = prices;
    if (!userChanged.current) return;
    userChanged.current = false;
    if (prices.min !== previous.min || prices.max !== previous.max) {
      scheduleEmit();
    }
  }, [prices, scheduleEmit]);

  const updateUserPrices = (update: (current: Prices) => Prices) => {
    userChanged.current = true;
    setPrices(update);
  };

  const onInputBlur = () => {
    clearPendingEmit();
    emitRange();
  };

  const [dragging, setDragging] = useState<DragType>(null);
  const sliderElement = useRef<HTMLDivElement>(null);
  const sliderRect = useRef<DOMRect | null>(null);
  const rangeMin = filter.min ?? 0;
  const rangeMax = filter.max ?? 100;

  const clampThumb = useCallback(
    (type: "min" | "max", value: number) => {
      userChanged.current = true;
      setPrices((current) => {
        if (type === "min") {
          return value >= rangeMin && value <= current.max
            ? { ...current, min: value }
            : current;
        }
        return value <= rangeMax && value >= current.min
          ? { ...current, max: value }
          : current;
      });
    },
    [rangeMin, rangeMax],
  );

  useEffect(() => {
    if (!dragging) return;

    const updateSliderValue = (clientX: number) => {
      const rect = sliderRect.current;
      if (!rect) return;
      const percent = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1,
      );
      clampThumb(
        dragging,
        Math.round(rangeMin + percent * (rangeMax - rangeMin)),
      );
    };

    const onDrag = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      updateSliderValue(getClientX(event));
    };
    const stopDrag = () => {
      setDragging(null);
      sliderRect.current = null;
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [dragging, rangeMin, rangeMax, clampThumb]);

  const startDrag = (type: "min" | "max") => {
    setDragging(type);
    sliderRect.current = sliderElement.current?.getBoundingClientRect() ?? null;
  };

  const onMouseDownThumb =
    (type: "min" | "max") => (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      startDrag(type);
    };

  const onThumbKeyDown =
    (type: "min" | "max") => (event: KeyboardEvent<HTMLButtonElement>) => {
      const step = getKeyStep(event.key);
      if (!step) return;
      event.preventDefault();
      clampThumb(type, (type === "min" ? prices.min : prices.max) + step);
    };

  const span = rangeMax - rangeMin;
  const toPercent = (value: number) =>
    span > 0 ? ((value - rangeMin) / span) * 100 : 0;
  const minPercent = toPercent(prices.min);
  const maxPercent = toPercent(prices.max);
  const widthPercent = maxPercent - minPercent;
  const panelId = useId();

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-4">
      {displayMode === "accordion" && (
        <div className="self-stretch flex flex-col justify-center items-center">
          <button
            type="button"
            className="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
            onClick={toggle}
            aria-expanded={isFilterVisible}
            aria-controls={panelId}
          >
            <div className="flex-1 flex items-center gap-2.5">
              <div className="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
                {filter.label}
              </div>
            </div>
            <span
              className="flex items-center justify-center"
              aria-hidden="true"
            >
              <ChevronDownIcon
                width={24}
                height={24}
                className={cx(
                  "transition-transform",
                  isFilterVisible && "rotate-180",
                )}
              />
            </span>
          </button>
        </div>
      )}

      {(isFilterVisible || displayMode === "dropdown") && (
        <div
          id={panelId}
          className="self-stretch flex flex-col justify-start items-start gap-2.5"
        >
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-between items-center gap-2">
              <div className="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5">
                <input
                  type="number"
                  placeholder={t.listing.min}
                  aria-label={t.listing.min}
                  value={prices.min}
                  onChange={(event) => {
                    const min = toInputNumber(event);
                    updateUserPrices((current) => ({ ...current, min }));
                  }}
                  onBlur={onInputBlur}
                  className="w-full bg-transparent border-none outline-hidden text-surface-on-surface text-sm font-normal leading-tight"
                  min={filter.min}
                  max={prices.max}
                />
              </div>
              <div className="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5">
                <input
                  type="number"
                  placeholder={t.listing.max}
                  aria-label={t.listing.max}
                  value={prices.max}
                  onChange={(event) => {
                    const max = toInputNumber(event);
                    updateUserPrices((current) => ({ ...current, max }));
                  }}
                  onBlur={onInputBlur}
                  className="w-full bg-transparent border-none outline-hidden text-surface-on-surface text-sm font-normal leading-tight"
                  min={prices.min}
                  max={filter.max}
                />
              </div>
            </div>
            <div
              ref={sliderElement}
              className="relative w-64 h-10 mt-2 mx-auto flex items-center select-none"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-surface-surface-container-highest rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-surface-surface-primary rounded-full"
                style={{ left: `${minPercent}%`, width: `${widthPercent}%` }}
              />
              <button
                type="button"
                aria-label={t.listing.min}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer touch-none"
                style={{ left: `calc(${minPercent}% - 10px)` }}
                onMouseDown={onMouseDownThumb("min")}
                onTouchStart={() => startDrag("min")}
                onKeyDown={onThumbKeyDown("min")}
              />
              <button
                type="button"
                aria-label={t.listing.max}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer touch-none"
                style={{ left: `calc(${maxPercent}% - 10px)` }}
                onMouseDown={onMouseDownThumb("max")}
                onTouchStart={() => startDrag("max")}
                onKeyDown={onThumbKeyDown("max")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
