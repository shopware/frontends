import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockVimeoVideo as CmsBlockVimeoVideoContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockVimeoVideo({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockVimeoVideoContent>) {
  const slotContent = getSlotContent(content, "video");

  return (
    <div
      className={cx("cms-block-vimeo-video relative", className)}
      style={style}
    >
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
