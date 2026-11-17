import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockCenterText as CmsBlockCenterTextContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockCenterText({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockCenterTextContent>) {
  const slotLeftContent = getSlotContent(content, "left");
  const slotRightContent = getSlotContent(content, "right");
  const slotCenterContent = getSlotContent(content, "center");

  return (
    <div
      className={cx(
        "cms-block-center-text grid md:grid-cols-3 gap-10 content-center",
        "[&_.cms-element-image]:self-stretch [&_.cms-element-image]:min-h-12",
        className,
      )}
      style={style}
    >
      <CmsGenericElement content={slotLeftContent} ctx={ctx} />
      <CmsGenericElement content={slotCenterContent} ctx={ctx} />
      <CmsGenericElement content={slotRightContent} ctx={ctx} />
    </div>
  );
}
