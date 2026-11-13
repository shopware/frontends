import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockProductSlider as CmsBlockProductSliderContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockProductSlider({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockProductSliderContent>) {
  return (
    <div className={cx("cms-block-product-slider", className)} style={style}>
      {content.slots.map((slot) => (
        <CmsGenericElement key={slot.id} content={slot} ctx={ctx} />
      ))}
    </div>
  );
}
