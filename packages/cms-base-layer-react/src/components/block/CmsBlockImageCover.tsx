import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageCover as CmsBlockImageCoverContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageCover({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageCoverContent>) {
  const cmsContent = getSlotContent(content, "image");

  return (
    <div className={cx("cms-block-image-cover", className)} style={style}>
      {cmsContent && <CmsGenericElement content={cmsContent} ctx={ctx} />}
    </div>
  );
}
