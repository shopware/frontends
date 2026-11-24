import { decodeHTMLAttribute, escapeAttribute } from "entities";
// Only `FilterXSS` and `filterXSS` are static exports of this CommonJS module.
// Nitro keeps xss external, so any other named import (e.g.
// `getDefaultWhiteList`) fails at SSR runtime with "Named export not found".
import { FilterXSS } from "xss";

import { isSafeUrl } from "../html-to-vue/getOptionsFromNode";

// No `whiteList` option: FilterXSS falls back to xss's default whitelist.
const filter = new FilterXSS({
  // Remove tags outside the whitelist instead of escaping them, so shoppers
  // never see raw `<iframe>` markup; drop script and style bodies entirely.
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  onTagAttr(_tag, name, value, isWhiteAttr) {
    if (!isWhiteAttr || (name !== "href" && name !== "src")) return undefined;
    // xss's own check clears every URL that is not absolute or root-relative
    // (`kontakt`, `?page=2`, `sms:`); use the same check as CmsElementText.
    // Decode with `entities`, not xss's friendlyAttrValue: that one leaves
    // named entities such as `&Tab;` alone, which the browser would then
    // decode into `java\tscript:`.
    const decoded = decodeHTMLAttribute(value);
    return isSafeUrl(decoded, name)
      ? `${name}="${escapeAttribute(decoded)}"`
      : "";
  },
});

/**
 * Sanitizes merchant HTML that is rendered with `v-html` / `innerHTML`.
 * Pure string processing, so SSR and hydration produce the same markup.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  return html ? filter.process(html) : "";
}
