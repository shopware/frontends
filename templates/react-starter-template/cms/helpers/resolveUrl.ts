import { buildUrlPrefix, urlIsAbsolute } from "@shopware/helpers";

const MAX_URL_LENGTH = 2083;
/**
 * Category links in Shopware rich text are stored as
 * `<segment>/navigation/<categoryId>`, optionally followed by `#` or a
 * query/fragment, where `<segment>` is the SEO domain placeholder or a language
 * code (`en-GB`), not a real path. It is dropped and the storefront prefix is
 * applied instead.
 *
 * Anchored at both ends with only `[a-zA-Z0-9-]` in the first segment, so it never
 * matches a URL with a scheme (`https:`, `javascript:`), a protocol-relative
 * `//host` or a deeper relative path, and the rewrite always yields
 * `navigation/<id>…`, which cannot carry a scheme.
 */
const NAVIGATION_PLACEHOLDER_PATTERN =
  /^[a-zA-Z0-9-]+\/(navigation\/[a-zA-Z0-9]+(?:[?#][\s\S]*)?)$/;

export function resolveCmsUrl(url: string, urlPrefix: string): string {
  // A real navigation link is short; skip the rewrite instead of throwing, so
  // one overlong CMS link cannot take down the whole page render.
  if (url.length > MAX_URL_LENGTH) {
    return url;
  }
  const match = NAVIGATION_PLACEHOLDER_PATTERN.exec(url);
  if (match?.[1]) {
    return buildUrlPrefix(match[1], urlPrefix).path;
  }
  return url;
}

export function prefixUrl(url: string, urlPrefix: string): string {
  return buildUrlPrefix(url, urlPrefix).path;
}

export function isInternalUrl(url: string): boolean {
  return (
    !urlIsAbsolute(url) &&
    !url.startsWith("//") &&
    !url.startsWith("#") &&
    !url.startsWith("mailto:") &&
    !url.startsWith("tel:")
  );
}
