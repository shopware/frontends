import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockProductThreeColumn as CmsBlockProductThreeColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockProductThreeColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockProductThreeColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");
  const centerContent = getSlotContent(content, "center");

  return (
    <div
      className={cx(
        "flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:flex-1">
        <CmsGenericElement content={leftContent} ctx={ctx} className="w-full" />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement
          content={centerContent}
          ctx={ctx}
          className="w-full"
        />
      </div>
      <div className="w-full sm:flex-1">
        <CmsGenericElement
          content={rightContent}
          ctx={ctx}
          className="w-full"
        />
      </div>
    </div>
  );
}
