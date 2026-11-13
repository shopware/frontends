import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageSimpleGrid as CmsBlockImageSimpleGridContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageSimpleGrid({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageSimpleGridContent>) {
  const leftTopContent = getSlotContent(content, "left-top");
  const leftBottomContent = getSlotContent(content, "left-bottom");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "flex flex-col md:flex-row justify-start items-start gap-6 w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full md:flex-1 flex flex-col justify-start items-start gap-6">
        <div className="w-full">
          <CmsGenericElement content={leftTopContent} ctx={ctx} />
        </div>
        <div className="w-full">
          <CmsGenericElement content={leftBottomContent} ctx={ctx} />
        </div>
      </div>
      <div className="w-full md:flex-1">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
