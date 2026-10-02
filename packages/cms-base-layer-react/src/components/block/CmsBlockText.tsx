import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockText as CmsBlockTextContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockText({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextContent>) {
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
