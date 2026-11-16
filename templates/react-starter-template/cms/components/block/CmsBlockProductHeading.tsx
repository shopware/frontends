import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockProductHeading as CmsBlockProductHeadingContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockProductHeading({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockProductHeadingContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "cms-block-product-heading flex justify-between pt-4",
        "[&_.cms-element-image]:max-h-[7.5rem] [&_.cms-element-image]:max-w-[7.5rem]",
        className,
      )}
      style={style}
    >
      <CmsGenericElement content={leftContent} ctx={ctx} />
      <CmsGenericElement content={rightContent} ctx={ctx} />
    </div>
  );
}
