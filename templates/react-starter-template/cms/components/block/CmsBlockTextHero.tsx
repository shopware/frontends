import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextHero as CmsBlockTextHeroContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextHero({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextHeroContent>) {
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
