import type { ReactNode } from "react";

import { cx } from "../../helpers/cx";
import { formatPrice } from "../../helpers/formatPrice";
import type { PriceFormatOptions } from "../../helpers/formatPrice";

export type SwSharedPriceProps = {
  value: number | undefined;
  ctx: PriceFormatOptions;
  className?: string;
  beforePrice?: ReactNode;
  afterPrice?: ReactNode;
};

export function SwSharedPrice({
  value,
  ctx,
  className,
  beforePrice,
  afterPrice,
}: SwSharedPriceProps) {
  return (
    <p className={cx("flex gap-1", className)}>
      {beforePrice}
      <span>{formatPrice(value, ctx)}</span>
      {afterPrice}
    </p>
  );
}
