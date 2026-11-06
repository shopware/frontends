import { cx } from "../../helpers/cx";
import { getCmsLayout } from "../../helpers/layout";
import type { CmsComponentProps } from "../../registry";
import type { CmsSectionDefault as CmsSectionDefaultContent } from "../../types";
import { CmsGenericBlock } from "../core/CmsGenericBlock";

export function CmsSectionDefault({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsSectionDefaultContent>) {
  const layout = getCmsLayout(content);
  const sectionCtx = { ...ctx, sectionLayout: "default" as const };

  return (
    <div
      className={cx("my-4", className)}
      style={{ ...layout.margins, ...style }}
    >
      {content.blocks.map((block) => (
        <CmsGenericBlock key={block.id} content={block} ctx={sectionCtx} />
      ))}
    </div>
  );
}
