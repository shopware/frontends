import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockCategoryNavigation as CmsBlockCategoryNavigationContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockCategoryNavigation({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockCategoryNavigationContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <div className={className} style={style}>
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
