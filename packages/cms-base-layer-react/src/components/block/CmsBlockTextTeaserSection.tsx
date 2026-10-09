import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockTextTeaserSection as CmsBlockTextTeaserSectionContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockTextTeaserSection({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockTextTeaserSectionContent>) {
  return (
    <div
      className={cx("mx-auto grid md:grid-cols-3 gap-4 py-6", className)}
      style={style}
    >
      {content.slots.map((slot, index) => (
        <CmsGenericElement
          key={slot.id}
          content={slot}
          ctx={ctx}
          className={cx(
            "cms-block-text-teaser-section",
            index === 0 && "md:col-span-1",
            index === 1 && "md:col-span-2",
          )}
        />
      ))}
    </div>
  );
}
