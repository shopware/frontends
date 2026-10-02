import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageTwoColumn as CmsBlockImageTwoColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageTwoColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTwoColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "cms-block-image-two-column flex flex-col md:flex-row justify-start items-start gap-6 w-full",
        "[&_.cms-element-image]:relative [&_.cms-element-image]:h-full [&_.cms-element-image]:w-full",
        "[&_.cms-element-image_img]:h-full [&_.cms-element-image_img]:w-full [&_.cms-element-image_img]:object-cover",
        "[&_.cms-element-image-slider]:w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full md:flex-1 md:min-w-0">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full md:flex-1 md:min-w-0">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
