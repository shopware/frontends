import { getTranslatedProperty } from "@shopware/helpers";

import { getConfigValue } from "../../helpers/slots";
import type { CmsComponentProps } from "../../registry";
import type { CmsElementProductName as CmsElementProductNameContent } from "../../types";
import { CmsElementText } from "./CmsElementText";

const PRODUCT_NAME_CLASS =
  "self-stretch text-surface-on-surface text-4xl font-normal font-serif leading-[60px]";

export function CmsElementProductName({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<CmsElementProductNameContent>) {
  const hasCmsContent = !!(
    content.data?.content || getConfigValue(content, "content")
  );
  const productName = getTranslatedProperty(ctx.product, "name");
  const textContent: CmsElementProductNameContent =
    hasCmsContent || !productName
      ? content
      : {
          ...content,
          data: { content: productName, apiAlias: "cms_text" },
        };

  return (
    <div role="heading" aria-level={1} className={className} style={style}>
      <CmsElementText
        content={textContent}
        ctx={ctx}
        className={PRODUCT_NAME_CLASS}
      />
    </div>
  );
}
