import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextOnImage as CmsBlockTextOnImageContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextOnImage({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextOnImageContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <div
      className={cx(
        "cms-block-text-on-image min-h-[500px] py-20 bg-cover bg-bottom bg-no-repeat relative",
        className,
      )}
      style={style}
    >
      {slotContent && <CmsGenericElement content={slotContent} ctx={ctx} />}
    </div>
  );
}
