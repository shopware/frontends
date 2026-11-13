import type { CmsConfig } from "../../context";
import { cx } from "../../helpers/cx";
import { getImagePlaceholder } from "../../helpers/imagePlaceholder";

export type ProductCardSkeletonProps = {
  ctx?: { config: Pick<CmsConfig, "imagePlaceholder"> };
  className?: string;
};

export function ProductCardSkeleton({
  ctx,
  className,
}: ProductCardSkeletonProps) {
  const placeholderSvg = getImagePlaceholder(
    ctx?.config.imagePlaceholder.color,
  );

  return (
    <div
      role="status"
      className={cx(
        "p-px flex flex-col justify-start items-start overflow-hidden",
        className,
      )}
    >
      <div className="self-stretch min-h-[350px] relative flex items-center justify-center overflow-hidden aspect-square animate-pulse">
        <img
          src={placeholderSvg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full pt-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-4" />
        <div className="h-5 bg-gray-200 rounded-full w-20 mb-3" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
