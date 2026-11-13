import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageFourColumn as CmsBlockImageFourColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageFourColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageFourColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const centerLeftContent = getSlotContent(content, "center-left");
  const centerRightContent = getSlotContent(content, "center-right");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "cms-block-image-four-column flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-start items-start gap-6 w-full",
        "[&_.cms-element-image]:relative [&_.cms-element-image]:h-full [&_.cms-element-image]:w-full",
        "[&_.cms-element-image_img]:h-full [&_.cms-element-image_img]:w-full [&_.cms-element-image_img]:object-cover",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:w-[calc(50%-12px)] lg:flex-1">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:flex-1">
        <CmsGenericElement content={centerLeftContent} ctx={ctx} />
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:flex-1">
        <CmsGenericElement content={centerRightContent} ctx={ctx} />
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:flex-1">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
