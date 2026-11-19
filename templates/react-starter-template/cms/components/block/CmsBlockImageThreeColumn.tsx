import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageThreeColumn as CmsBlockImageThreeColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageThreeColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageThreeColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const centerContent = getSlotContent(content, "center");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={centerContent} ctx={ctx} />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </div>
  );
}
