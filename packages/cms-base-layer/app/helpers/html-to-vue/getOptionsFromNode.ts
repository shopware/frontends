import { decodeHTMLAttribute } from "entities";

export type NodeObject = {
  type: string;
  name: string;
  attrs?: Options;
  children: NodeObject[];
  voidElement: boolean;
  content: string;
};

export type Options = {
  align?: string;
  attrs: Record<string, string>;
  class?: string;
  color?: string;
  style?: string;
  href?: string;
};

/**
 * Attributes whose value the browser treats as a URL, and therefore could run
 * script through a `javascript:` (or similar) scheme.
 */
const URL_ATTRIBUTES = new Set([
  "href",
  "src",
  "action",
  "formaction",
  "poster",
  "cite",
  "background",
  "xlink:href",
]);

const UNSAFE_SCHEME = /^(?:javascript|vbscript|data):/;
const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|jpe?g|webp|avif);/;

/**
 * Whether a URL attribute value is safe to render. Checks the value after
 * entity decoding and normalises it the way a browser's URL parser does:
 * ASCII tab and newlines are removed anywhere, leading control characters and
 * spaces are dropped, and the scheme is case-insensitive.
 */
export function isSafeUrl(url: string, attribute = "href"): boolean {
  const normalized = url
    .replace(/[\t\n\r]/g, "")
    // oxlint-disable-next-line no-control-regex -- browsers strip these from URLs
    .replace(/^[\u0000- ]+/, "")
    .toLowerCase();

  if (!UNSAFE_SCHEME.test(normalized)) {
    return true;
  }
  return attribute === "src" && SAFE_DATA_IMAGE.test(normalized);
}

function decode(value: string): string {
  // html-to-ast yields strings, but keep anything else (e.g. a hand-built
  // node) as it was rather than stringifying it
  return typeof value === "string" ? decodeHTMLAttribute(value) : value;
}

/**
 * Builds the props for `h()` from an html-to-ast node.
 *
 * The parser keeps attribute values exactly as written in the HTML, entities
 * included, while Vue escapes every attribute value it renders. Values are
 * decoded here so they are escaped exactly once — `&amp;` stays `&amp;` in the
 * output instead of becoming `&amp;amp;`. Because decoding can turn an
 * obfuscated scheme (`javascript&colon;`) into a working one, URL attributes
 * are checked after decoding and dropped when unsafe.
 */
export function getOptionsFromNode(
  node: NodeObject,
  resolveUrl: (url: string) => string,
): Options {
  const response: Options = {
    attrs: {},
  };
  try {
    if (!node?.attrs) {
      return response;
    }

    const { align, style, class: classNames, href, ...attrs } = node.attrs;

    if (align) {
      response.align = decode(align);
    }
    if (style) {
      response.style = decode(style);
    }
    if (classNames) {
      response.class = decode(classNames);
    }
    for (const [name, rawValue] of Object.entries(
      attrs as unknown as Record<string, string>,
    )) {
      const value = decode(rawValue);
      if (
        URL_ATTRIBUTES.has(name.toLowerCase()) &&
        !isSafeUrl(value, name.toLowerCase())
      ) {
        continue;
      }
      response.attrs[name] = value;
    }
    if (href) {
      const decodedHref = decode(href);
      if (isSafeUrl(decodedHref)) {
        response.attrs.href = resolveUrl(decodedHref);
      }
    }
  } catch (e) {
    console.error("[Shopware][cms][getOptionsFromNode] error", e);
  }
  return response;
}
