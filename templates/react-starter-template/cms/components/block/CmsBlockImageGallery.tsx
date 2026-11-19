import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageGallery as CmsBlockImageGalleryContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageGallery({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageGalleryContent>) {
  const cmsContent = getSlotContent(content, "imageGallery");

  return (
    <div className={cx("cms-block-image-gallery", className)} style={style}>
      <CmsGenericElement content={cmsContent} ctx={ctx} />
    </div>
  );
}
