import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockCrossSelling as CmsBlockCrossSellingContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockCrossSelling({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockCrossSellingContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <div className={cx("cms-block-cross-selling", className)} style={style}>
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
