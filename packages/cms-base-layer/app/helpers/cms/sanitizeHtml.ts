import { decodeHTMLAttribute, escapeAttribute } from "entities";
import { FilterXSS, getDefaultWhiteList } from "xss";

import { isSafeUrl } from "../html-to-vue/getOptionsFromNode";

const whiteList = getDefaultWhiteList();

const filter = new FilterXSS({
  whiteList,
  // Remove tags outside the whitelist instead of escaping them, so shoppers
  // never see raw `<iframe>` markup; drop script and style bodies entirely.
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  onTagAttr(tag, name, value) {
    if (name !== "href" && name !== "src") return undefined;
    if (!whiteList[tag]?.includes(name)) return undefined;
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
