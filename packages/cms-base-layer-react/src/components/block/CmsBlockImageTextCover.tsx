import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockImageTextCover as CmsBlockImageTextCoverContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockImageTextCover({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockImageTextCoverContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");

  return (
    <article
      className={cx(
        "flex flex-col md:flex-row justify-start items-start gap-6 w-full pb-6",
        className,
      )}
      style={style}
    >
      <div className="w-full md:flex-1 px-6 pt-6 md:px-0 md:pt-6 md:pl-6">
        <CmsGenericElement content={leftContent} ctx={ctx} />
      </div>
      <div className="w-full md:flex-1 px-6 pt-0 md:pt-6 pb-6 md:px-0 md:pr-6">
        <CmsGenericElement content={rightContent} ctx={ctx} />
      </div>
    </article>
  );
}
