import type { Schemas } from "#shopware";

import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockDefault({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<Schemas["CmsBlock"]>) {
  return (
    <div className={cx("cms-block-default", className)} style={style}>
      {content.slots.map((slot) => (
        <CmsGenericElement key={slot.id} content={slot} ctx={ctx} />
      ))}
    </div>
  );
}
