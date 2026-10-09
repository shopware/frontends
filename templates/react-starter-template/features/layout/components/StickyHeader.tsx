"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export const STICKY_HEADER_HEIGHT_PROPERTY = "--sticky-header-height";

export type StickyHeaderProps = {
  className?: string;
  children: ReactNode;
};

export function StickyHeader({ className, children }: StickyHeaderProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty(
        STICKY_HEADER_HEIGHT_PROPERTY,
        `${header.getBoundingClientRect().height}px`,
      );
    });
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty(STICKY_HEADER_HEIGHT_PROPERTY);
    };
  }, []);

  return (
    <header ref={ref} className={className} data-sticky-header="">
      {children}
    </header>
  );
}
