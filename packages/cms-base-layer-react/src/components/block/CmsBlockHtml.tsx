import type { CmsComponentProps } from "../../registry";
import type { CmsBlockHtml as CmsBlockHtmlContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockHtml({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockHtmlContent>) {
  return (
    <div className={className} style={style}>
      {content.slots.map((slot) => (
        <CmsGenericElement key={slot.id} content={slot} ctx={ctx} />
      ))}
    </div>
  );
}
