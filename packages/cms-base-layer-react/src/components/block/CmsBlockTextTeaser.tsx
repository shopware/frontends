import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextTeaser as CmsBlockTextTeaserContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextTeaser({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextTeaserContent>) {
  return (
    <div className={className} style={style}>
      {content.slots.map((slot) => (
        <CmsGenericElement key={slot.id} content={slot} ctx={ctx} />
      ))}
    </div>
  );
}
