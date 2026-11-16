import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockYoutubeVideo as CmsBlockYoutubeVideoContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockYoutubeVideo({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockYoutubeVideoContent>) {
  const slotContent = getSlotContent(content, "video");

  return (
    <div
      className={cx("cms-block-youtube-video relative", className)}
      style={style}
    >
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
