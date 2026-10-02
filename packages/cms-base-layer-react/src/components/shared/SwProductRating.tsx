import { cx } from "../../helpers/cx";

export type SwProductRatingProps = {
  rating?: number;
  reviewCount?: number;
  starSize?: number;
  showCount?: boolean;
  className?: string;
};

const STAR_FILLED_PATH =
  "M4.53339 15.5446C3.85953 15.8416 3.07255 15.536 2.7756 14.8622C2.68261 14.6511 2.64594 14.4196 2.66917 14.1902L3.0508 10.421L0.526591 7.59599C0.0359476 7.04688 0.083346 6.20399 0.632458 5.71335C0.804415 5.5597 1.01328 5.45328 1.23866 5.40448L4.94128 4.60269L6.848 1.32905C7.21862 0.692736 8.0349 0.477347 8.67122 0.847967C8.87048 0.964028 9.03624 1.12979 9.1523 1.32905L11.059 4.60269L14.7616 5.40448C15.4813 5.56033 15.9384 6.2701 15.7826 6.9898C15.7338 7.21517 15.6274 7.42404 15.4737 7.59599L12.9495 10.421L13.3311 14.1902C13.4053 14.9228 12.8715 15.5769 12.1389 15.651C11.9095 15.6743 11.6779 15.6376 11.4669 15.5446L8.00015 14.0169L4.53339 15.5446Z";

const STAR_EMPTY_PATH =
  "M8.00015 12.5599L12.0046 14.3245L11.5638 9.97075L14.4795 6.70761L10.2026 5.78147L8.00015 2.00012L5.79771 5.78147L1.52085 6.70761L4.43653 9.97075L3.99572 14.3245L8.00015 12.5599ZM4.53339 15.5446C3.85953 15.8416 3.07255 15.536 2.7756 14.8622C2.68261 14.6511 2.64594 14.4196 2.66917 14.1902L3.0508 10.421L0.526591 7.59599C0.0359476 7.04688 0.083346 6.20399 0.632458 5.71335C0.804415 5.5597 1.01328 5.45328 1.23866 5.40448L4.94128 4.60269L6.848 1.32905C7.21862 0.692736 8.0349 0.477347 8.67122 0.847967C8.87048 0.964028 9.03624 1.12979 9.1523 1.32905L11.059 4.60269L14.7616 5.40448C15.4813 5.56033 15.9384 6.2701 15.7826 6.9898C15.7338 7.21517 15.6274 7.42404 15.4737 7.59599L12.9495 10.421L13.3311 14.1902C13.4053 14.9228 12.8715 15.5769 12.1389 15.651C11.9095 15.6743 11.6779 15.6376 11.4669 15.5446L8.00015 14.0169L4.53339 15.5446Z";

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={filled ? STAR_FILLED_PATH : STAR_EMPTY_PATH}
        fill="#696470"
      />
    </svg>
  );
}

const STAR_POSITIONS = [1, 2, 3, 4, 5];

export function SwProductRating({
  rating = 0,
  reviewCount = 0,
  starSize = 16,
  showCount = true,
  className,
}: SwProductRatingProps) {
  const filledStars = Math.round(rating);

  return (
    <div className={cx("flex items-center", className)}>
      <div
        className="flex items-center gap-1.5"
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {STAR_POSITIONS.map((position) => (
          <StarIcon
            key={`star-${position}`}
            filled={position <= filledStars}
            size={starSize}
          />
        ))}
      </div>
      {showCount && reviewCount > 0 ? (
        <span className="ml-1 text-surface-on-surface-variant text-base leading-normal">
          {`(${reviewCount})`}
        </span>
      ) : null}
    </div>
  );
}
