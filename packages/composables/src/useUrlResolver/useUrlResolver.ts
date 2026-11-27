import { buildUrlPrefix } from "@shopware/helpers";
import { inject } from "vue";

/**
 * Category links in Shopware rich text are stored as
 * `<segment>/navigation/<categoryId>`, optionally followed by `#` or a
 * query/fragment, where `<segment>` is the SEO domain placeholder or a language
 * code (`en-GB`), not a real path. It is dropped and the storefront prefix is
 * applied instead.
 *
 * Anchored at both ends with only `[a-zA-Z0-9-]` in the first segment, so it
 * never matches a URL with a scheme (`https:`, `javascript:`), a
 * protocol-relative `//host` or a deeper relative path, and the rewrite always
 * yields `navigation/<id>…`, which cannot carry a scheme.
 */
const NAVIGATION_PLACEHOLDER_PATTERN =
  /^[a-zA-Z0-9-]+\/(navigation\/[a-zA-Z0-9]+(?:[?#][\s\S]*)?)$/;

export function useUrlResolver() {
  const urlPrefix = inject("urlPrefix", "");
  const getUrlPrefix = () => urlPrefix;

  const resolveUrl = (url: string) => {
    // @see: https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos/
    if (url.length > 2083) {
      throw new Error("URL Input too long");
    }

    const match = NAVIGATION_PLACEHOLDER_PATTERN.exec(url);
    if (match?.[1]) {
      return buildUrlPrefix(match[1], getUrlPrefix()).path;
    }

    return url;
  };

  return {
    resolveUrl,
    getUrlPrefix,
  };
}
