import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextTwoColumn as CmsBlockTextTwoColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextTwoColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextTwoColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const rightContent = getSlotContent(content, "right");

  return (
    <article
      className={cx(
        "cms-block-text-two-column grid md:grid-cols-2 gap-5 md:gap-20",
        className,
      )}
      style={style}
    >
      <CmsGenericElement
        content={leftContent}
        ctx={ctx}
        className="cms-block-text-two-column__text"
      />
      <CmsGenericElement
        content={rightContent}
        ctx={ctx}
        className="cms-block-text-two-column__text"
      />
    </article>
  );
}
