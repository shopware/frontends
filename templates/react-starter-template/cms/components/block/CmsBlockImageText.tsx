import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageText as CmsBlockImageTextContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageText({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTextContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");

  return (
    <div
      className={cx(
        "flex flex-col md:flex-row justify-start items-stretch gap-6 w-full",
        className,
      )}
      style={style}
    >
      <div className="w-full md:flex-1 min-w-0 p-4 flex flex-col">
        <CmsGenericElement content={leftContent} ctx={ctx} className="flex-1" />
      </div>
      <div className="w-full md:flex-1 min-w-0 p-4 flex flex-col">
        <CmsGenericElement
          content={rightContent}
          ctx={ctx}
          className="flex-1"
        />
      </div>
    </div>
  );
}
