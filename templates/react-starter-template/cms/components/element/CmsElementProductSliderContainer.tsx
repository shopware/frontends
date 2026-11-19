"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import type { VerticalAlign } from "../../types";
import { SwSlider } from "../shared/SwSlider";
import { getSlidesToShow, getSsrBreakpoints } from "./sliderLayout";
import { useElementWidth } from "./useElementWidth";

export type CmsElementProductSliderContainerProps = {
  title?: string;
  border?: boolean;
  elMinWidth: number;
  slotCount: number;
  verticalAlign?: VerticalAlign;
  navigation?: boolean;
  autoplay?: boolean;
  children?: ReactNode;
};

export function CmsElementProductSliderContainer({
  title,
  border = false,
  elMinWidth,
  slotCount,
  verticalAlign,
  navigation = false,
  autoplay = false,
  children,
}: CmsElementProductSliderContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(containerRef);
  const slidesToShow = getSlidesToShow(width, slotCount, elMinWidth);
  const ssrBreakpoints = getSsrBreakpoints(slidesToShow, elMinWidth, slotCount);
  const navigationValue = navigation ? "outside" : "";

  return (
    <div ref={containerRef} className="cms-element-product-slider">
      {title ? (
        <h3 className="pl-6 pb-6 text-center md:text-left text-surface-on-surface">
          {title}
        </h3>
      ) : null}
      <div
        className={
          border ? "py-5 border border-outline-outline-variant" : undefined
        }
      >
        <SwSlider
          minHeight="450px"
          verticalAlign={verticalAlign || ""}
          displayMode="contain"
          navigationDots={navigationValue}
          navigationArrows={navigationValue}
          gap="1.25rem"
          slidesToShow={slidesToShow}
          slidesToScroll={1}
          autoplay={autoplay}
          ssrBreakpoints={ssrBreakpoints}
        >
          {children}
        </SwSlider>
      </div>
    </div>
  );
}
