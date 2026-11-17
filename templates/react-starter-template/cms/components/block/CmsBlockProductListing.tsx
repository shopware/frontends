import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockProductListing as CmsBlockProductListingContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockProductListing({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockProductListingContent>) {
  const slotContent = getSlotContent(content, "content");

  return (
    <div className={className} style={style}>
      <CmsGenericElement content={slotContent} ctx={ctx} />
    </div>
  );
}
