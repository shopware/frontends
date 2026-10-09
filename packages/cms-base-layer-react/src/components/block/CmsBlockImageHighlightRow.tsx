import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageHighlightRow as CmsBlockImageHighlightRowContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageHighlightRow({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageHighlightRowContent>) {
  const leftContent = getSlotContent(content, "left");
  const centerContent = getSlotContent(content, "center");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "cms-block-image-highlight-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        "[&_.cms-element-image]:relative [&_.cms-element-image]:h-full [&_.cms-element-image]:w-full [&_.cms-element-image]:border-[12px] [&_.cms-element-image]:border-white",
        "[&_.cms-element-image_img]:h-full [&_.cms-element-image_img]:w-full [&_.cms-element-image_img]:object-cover",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={centerContent} ctx={ctx} />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
