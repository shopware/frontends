import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageSlider as CmsBlockImageSliderContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageSlider({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageSliderContent>) {
  const cmsContent = getSlotContent(content, "imageSlider");

  return (
    <div className={cx("cms-block-image-slider", className)} style={style}>
      <CmsGenericElement content={cmsContent} ctx={ctx} />
    </div>
  );
}
