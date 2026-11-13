import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockProductDescriptionReviews as CmsBlockProductDescriptionReviewsContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockProductDescriptionReviews({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockProductDescriptionReviewsContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <div
      className={cx("cms-block-product-description-reviews", className)}
      style={style}
    >
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
