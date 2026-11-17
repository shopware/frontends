import { cx } from "../../helpers/cx";
import { FavoriteFilledIcon, FavoriteIcon } from "../icons";

export type WishlistIconProps = {
  filled?: boolean;
  className?: string;
};

export function WishlistIcon({ filled = false, className }: WishlistIconProps) {
  return (
    <div className={cx("relative", className)}>
      {filled ? (
        <FavoriteFilledIcon className="w-6 h-5 hover:cursor-pointer" />
      ) : (
        <FavoriteIcon className="w-6 h-5 hover:cursor-pointer" />
      )}
    </div>
  );
}
