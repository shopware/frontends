import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageBubbleRow as CmsBlockImageBubbleRowContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageBubbleRow({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageBubbleRowContent>) {
  const leftContent = getSlotContent(content, "left");
  const centerContent = getSlotContent(content, "center");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "cms-block-image-bubble-row flex flex-col sm:flex-row justify-start items-start gap-6 w-full",
        "[&_.cms-element-image]:aspect-square [&_.cms-element-image]:max-w-[20rem] [&_.cms-element-image]:overflow-hidden [&_.cms-element-image]:rounded-full [&_.cms-element-image]:object-cover",
        className,
      )}
      style={style}
    >
      <div className="w-full sm:flex-1 flex items-center justify-center">
        <CmsGenericElement content={leftContent} ctx={ctx} className="w-full" />
      </div>
      <div className="w-full sm:flex-1 flex items-center justify-center">
        <CmsGenericElement
          content={centerContent}
          ctx={ctx}
          className="w-full"
        />
      </div>
      <div className="w-full sm:flex-1 flex items-center justify-center">
        <CmsGenericElement
          content={rightContent}
          ctx={ctx}
          className="w-full"
        />
      </div>
    </div>
  );
}
