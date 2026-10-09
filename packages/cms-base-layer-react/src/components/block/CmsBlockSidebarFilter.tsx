import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockSidebarFilter as CmsBlockSidebarFilterContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockSidebarFilter({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockSidebarFilterContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <CmsGenericElement
      content={slotContent}
      ctx={ctx}
      className={className}
      style={style}
    />
  );
}
