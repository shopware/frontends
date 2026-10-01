import { FilterXSS, escapeAttrValue, getDefaultWhiteList } from "xss";

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
const SAFE_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

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

function isRelativeOrSafeHref(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  const scheme = SCHEME_PATTERN.exec(trimmed)?.[0];
  if (!scheme) return true;
  return SAFE_SCHEMES.includes(scheme);
}

const filter = new FilterXSS({
  whiteList: buildWhiteList(),
  css: false,
  stripIgnoreTagBody: ["script", "style"],
  onTagAttr(_tag, name, value) {
    if (name === "href" && isRelativeOrSafeHref(value)) {
      return `href="${escapeAttrValue(value)}"`;
    }
    return undefined;
  },
  onIgnoreTagAttr(_tag, name, value) {
    if (name.startsWith("data-")) {
      return `${name}="${escapeAttrValue(value)}"`;
    }
    return undefined;
  },
});

export function sanitizeHtml(html: string): string {
  return filter.process(html);
}
