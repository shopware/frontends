import { cx } from "../../helpers/cx";
import { getSlotContent } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsBlockForm as CmsBlockFormContent } from "../../types";
import { CmsGenericElement } from "../core/CmsGenericElement";

export function CmsBlockForm({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsBlockFormContent>) {
  const cmsContent = getSlotContent(content, "content");

  return (
    <div className={cx("cms-block-form", className)} style={style}>
      {cmsContent && <CmsGenericElement content={cmsContent} ctx={ctx} />}
    </div>
  );
}
