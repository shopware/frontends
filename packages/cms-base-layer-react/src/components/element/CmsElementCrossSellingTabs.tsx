"use client";

import { useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { SwSlider } from "../shared/SwSlider";
import { getSlidesToShow, getSsrBreakpoints } from "./sliderLayout";
import { getNextTabIndex } from "./tabsKeyboard";
import { useElementWidth } from "./useElementWidth";

export type CmsElementCrossSellingTabsProps = {
  tabs: string[];
  panels: ReactNode[][];
  elMinWidth: number;
  slotCount: number;
  className?: string;
  style?: CSSProperties;
};

export function CmsElementCrossSellingTabs({
  tabs,
  panels,
  elMinWidth,
  slotCount,
  className,
  style,
}: CmsElementCrossSellingTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const width = useElementWidth(containerRef);
  const slidesToShow = getSlidesToShow(width, slotCount, elMinWidth);
  const ssrBreakpoints = getSsrBreakpoints(slidesToShow, elMinWidth, slotCount);
  const panelId = `${id}-panel`;
  const tabId = (index: number) => `${id}-tab-${index}`;

  function toggleTab(index: number) {
    if (currentTabIndex === index) return;
    setCurrentTabIndex(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = getNextTabIndex(event.key, currentTabIndex, tabs.length);
    if (next === undefined) return;
    event.preventDefault();
    toggleTab(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      ref={containerRef}
      className={cx("cms-element-cross-selling", className)}
      style={style}
    >
      <div className="flex gap-10 mb-5" role="tablist">
        {tabs.map((name, index) => (
          <button
            key={`tab-${index}`}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={tabId(index)}
            type="button"
            role="tab"
            aria-selected={currentTabIndex === index}
            aria-controls={panelId}
            tabIndex={currentTabIndex === index ? 0 : -1}
            className={cx(
              "transition text-lg font-semibold text-surface-on-surface-variant cursor-pointer",
              currentTabIndex === index &&
                "border-b-[3px] border-brand-primary text-brand-primary",
            )}
            onClick={() => toggleTab(index)}
            onKeyDown={onTabKeyDown}
          >
            {name}
          </button>
        ))}
      </div>
      {tabs.length ? (
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(currentTabIndex)}
        >
          <SwSlider
            key={currentTabIndex}
            className="transition-opacity duration-200 starting:opacity-0"
            minHeight="300px"
            displayMode="contain"
            navigationDots=""
            navigationArrows="outside"
            gap="1.25rem"
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            autoplay={false}
            ssrBreakpoints={ssrBreakpoints}
          >
            {panels[currentTabIndex]}
          </SwSlider>
        </div>
      ) : null}
    </div>
  );
}
