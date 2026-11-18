import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementProductBox as CmsElementProductBoxContent } from "../../types";
import { SwProductCard } from "../shared/SwProductCard";
import { SwProductCardSkeleton } from "../shared/SwProductCardSkeleton";

export function CmsElementProductBox({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementProductBoxContent>) {
  const product = content.data?.product;

  if (!product?.id) {
    return <SwProductCardSkeleton className={className} style={style} />;
  }

  return (
    <SwProductCard
      product={product}
      ctx={ctx}
      layoutType={getConfigValue(content, "boxLayout")}
      className={className}
      style={style}
    />
  );
}
