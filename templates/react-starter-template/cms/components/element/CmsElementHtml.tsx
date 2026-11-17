import { cx } from "../../helpers/cx";
import type { CmsComponentProps } from "../../registry";
import { sanitizeHtml } from "../../rich-text/sanitize";
import type { CmsElementHtml as CmsElementHtmlContent } from "../../types";

export function CmsElementHtml({
  content,
  className,
  style,
}: CmsComponentProps<CmsElementHtmlContent>) {
  return (
    <div
      className={cx("cms-element-html cms-element-text", className)}
      style={style}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(content.data?.content || ""),
      }}
    />
  );
}
