import type { CSSProperties } from "react";

import { cx } from "../../helpers/cx";

export type SwProductCardSkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function SwProductCardSkeleton({
  className,
  style,
}: SwProductCardSkeletonProps) {
  return (
    <div
      className={cx(
        "inline-flex flex-col items-start justify-start self-stretch overflow-hidden p-px w-full",
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      <div className="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden">
        <div className="relative h-80 w-full bg-gray-200 animate-pulse" />

        <div className="absolute top-[281px] left-2 inline-flex items-center justify-center rounded bg-gray-300 px-3 py-1 animate-pulse">
          <span className="h-3 w-16 bg-gray-200 rounded block" />
        </div>

        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
      </div>

      <div className="flex flex-col items-start justify-start gap-4 self-stretch p-2">
        <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />

        <div className="w-full">
          <div className="h-7 w-3/4 rounded bg-gray-200 mb-2 animate-pulse" />
          <div className="h-7 w-1/2 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />

        <div className="flex w-full gap-3">
          <div className="flex-1 h-10 rounded bg-gray-200 animate-pulse" />
          <div className="w-24 h-10 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
