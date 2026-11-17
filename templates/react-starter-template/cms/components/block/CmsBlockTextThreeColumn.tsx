import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextThreeColumn as CmsBlockTextThreeColumnContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextThreeColumn({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextThreeColumnContent>) {
  const leftContent = getSlotContent(content, "left");
  const centerContent = getSlotContent(content, "center");
  const rightContent = getSlotContent(content, "right");

  return (
    <article
      className={cx("grid md:grid-cols-3 gap-4", className)}
      style={style}
    >
      <CmsGenericElement content={leftContent} ctx={ctx} />
      <CmsGenericElement content={centerContent} ctx={ctx} />
      <CmsGenericElement content={rightContent} ctx={ctx} />
    </article>
  );
}
