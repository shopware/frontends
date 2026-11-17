import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockGalleryBuybox as CmsBlockGalleryBuyboxContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockGalleryBuybox({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockGalleryBuyboxContent>) {
  const rightContent = getSlotContent(content, "right");
  const leftContent = getSlotContent(content, "left");

  return (
    <div
      className={cx(
        "w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-10 lg:px-0 overflow-hidden",
        className,
      )}
      style={style}
    >
      <div className="w-full lg:w-3/5">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full lg:w-2/5">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
