import { cx } from "../../helpers/cx";
import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import {
  renderRichText,
  richTextClassName,
} from "../../rich-text/renderRichText";
import type {
  CmsElementProductName as CmsElementProductNameContent,
  CmsElementText as CmsElementTextContent,
} from "../../types";

const MISSING_CONTENT_HTML = "<div class='missing-content-element'></div>";

export type CmsElementTextProps = CmsComponentProps<
  CmsElementTextContent | CmsElementProductNameContent
>;

export function CmsElementText({
  content,
  ctx,
  className,
  style,
}: CmsElementTextProps) {
  const mappedContent =
    content.data?.content || getConfigValue(content, "content") || "";
  const rawHtml =
    mappedContent.length > 0 ? mappedContent : MISSING_CONTENT_HTML;
  const alignContent = getConfigValue(content, "verticalAlign") || undefined;
  const text = renderRichText(rawHtml, { urlPrefix: ctx.urlPrefix });

  if (alignContent) {
    return (
      <div
        className={cx("grid h-full", className)}
        style={{ alignContent, ...style }}
      >
        <div className={richTextClassName()}>{text}</div>
      </div>
    );
  }

  return (
    <div className={richTextClassName(className)} style={style}>
      {text}
    </div>
  );
}
