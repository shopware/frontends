import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageGalleryBig as CmsBlockImageGalleryBigContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageGalleryBig({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageGalleryBigContent>) {
  const cmsContent = getSlotContent(content, "imageGallery");

  return (
    <div
      className={cx(
        "cms-block-image-gallery-big w-full",
        "[&_.cms-element-image-gallery]:max-w-[1280px] [&_.cms-element-image-gallery]:mx-auto",
        "[&_.gallery-slider]:max-h-[800px]",
        "[&_img]:mx-auto [&_img]:object-contain",
        "[&_.gallery-slider-controls]:scale-125",
        className,
      )}
      style={style}
    >
      <CmsGenericElement content={cmsContent} ctx={ctx} />
    </div>
  );
}
