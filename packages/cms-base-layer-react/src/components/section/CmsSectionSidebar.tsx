import { cx } from "../../helpers/cx";
import { getPositionContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsSectionSidebar as CmsSectionSidebarContent } from "../../types";
import { CmsGenericBlock } from "../core/CmsGenericBlock";

export function CmsSectionSidebar({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsSectionSidebarContent>) {
  const sidebarBlocks = getPositionContent(content, "sidebar");
  const mainBlocks = getPositionContent(content, "main");
  const hideSidebarOnMobile = content.mobileBehavior === "hidden";
  const fullWidth = content.sizingMode === "full_width";
  const sectionCtx = { ...ctx, sectionLayout: "sidebar" as const };

  return (
    <div
      className={cx(
        "self-stretch flex flex-col lg:flex-row items-stretch gap-16",
        fullWidth && "px-6",
        className,
      )}
      style={style}
    >
      <aside
        className={
          hideSidebarOnMobile
            ? "hidden lg:block"
            : "w-full lg:w-72 xl:w-80 flex-shrink-0 bg-surface-surface flex flex-col justify-start items-stretch gap-4 lg:sticky lg:top-20 px-4 lg:px-0"
        }
      >
        {sidebarBlocks.map((block) => (
          <div key={block.id} className="w-full">
            <CmsGenericBlock content={block} ctx={sectionCtx} />
          </div>
        ))}
      </aside>
      <div className="flex-1 flex flex-col justify-start items-stretch gap-20">
        {mainBlocks.map((block) => (
          <div key={block.id} className="w-full">
            <CmsGenericBlock content={block} ctx={sectionCtx} />
          </div>
        ))}
      </div>
    </div>
  );
}
