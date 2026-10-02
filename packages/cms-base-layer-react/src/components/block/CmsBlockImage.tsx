import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImage as CmsBlockImageContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImage({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageContent>) {
  const imageContent = getSlotContent(content, "image");

  return (
    <div className={cx(className) || undefined} style={style}>
      <CmsGenericElement content={imageContent} ctx={ctx} />
    </div>
  );
}
