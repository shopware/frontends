import { decodeHTMLAttribute, escapeUTF8 } from "entities";
import { FilterXSS, getDefaultWhiteList } from "xss";

const EXTRA_ATTRIBUTES = [
  "class",
  "style",
  "id",
  "title",
  "align",
  "target",
  "rel",
  "loading",
  "width",
  "height",
];

const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const SAFE_HREF_SCHEMES = ["http:", "https:", "mailto:", "tel:", "sms:"];
const SAFE_SRC_SCHEMES = ["http:", "https:"];
const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|jpe?g|webp|avif);/;

function buildWhiteList(): Record<string, string[]> {
  const whiteList: Record<string, string[]> = {};
  for (const [tag, attributes] of Object.entries(getDefaultWhiteList())) {
    whiteList[tag] = [...new Set([...(attributes ?? []), ...EXTRA_ATTRIBUTES])];
  }
  whiteList.font = [
    ...new Set([...(whiteList.font ?? []), "color", "face", "size"]),
  ];
  whiteList.iframe = [
    "src",
    "allow",
    "allowfullscreen",
    "frameborder",
    "referrerpolicy",
    "sandbox",
    ...EXTRA_ATTRIBUTES,
  ];
  return whiteList;
}

/**
 * Whether a decoded `href` or `src` value is safe to render. Normalises the
 * value the way a browser's URL parser reads the scheme: whitespace and
 * control characters are ignored and the scheme is case-insensitive.
 * Values without a scheme (`kontakt`, `?page=2`, `media/a.jpg`) are relative.
 */
export function isSafeUrl(value: string, attribute: "href" | "src"): boolean {
  // oxlint-disable-next-line no-control-regex -- browsers ignore these in a scheme
  const compact = value.replace(/[\s\u0000-\u001F\u007F]+/g, "").toLowerCase();
  const scheme = SCHEME_PATTERN.exec(compact)?.[0];
  if (!scheme) return true;
  if (attribute === "src") {
    return SAFE_SRC_SCHEMES.includes(scheme) || SAFE_DATA_IMAGE.test(compact);
  }
  return SAFE_HREF_SCHEMES.includes(scheme);
}

const filter = new FilterXSS({
  whiteList: buildWhiteList(),
  css: false,
  stripIgnoreTagBody: ["script", "style"],
  onTagAttr(_tag, name, value, isWhiteAttr) {
    if (!isWhiteAttr || (name !== "href" && name !== "src")) return undefined;
    // Decode with `entities`, not xss's friendlyAttrValue: that one leaves
    // named entities such as `&Tab;` or `&colon;` alone, so
    // `java&Tab;script:` would pass the check and the browser would decode
    // it into a working `javascript:` URL.
    const decoded = decodeHTMLAttribute(value);
    // escapeUTF8, not escapeAttribute: `<` and `>` must be escaped too, or a
    // value holding `</iframe>` closes the raw-text iframe early. Every other
    // attribute and all text go through xss's escapeHtml, which escapes them.
    return isSafeUrl(decoded, name) ? `${name}="${escapeUTF8(decoded)}"` : "";
  },
  onIgnoreTagAttr(_tag, name, value) {
    if (name.startsWith("data-")) {
      return `${name}="${escapeUTF8(decodeHTMLAttribute(value))}"`;
    }
    return undefined;
  },
});

export function sanitizeHtml(html: string): string {
  return filter.process(html);
}
