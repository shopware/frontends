import { buildUrlPrefix } from "@shopware/helpers";
import { inject } from "vue";

export function useUrlResolver() {
  const urlPrefix = inject("urlPrefix", "");
  const getUrlPrefix = () => urlPrefix;

  const resolveUrl = (url: string) => {
    // @see: https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos/
    if (url.length > 2083) {
      throw new Error("URL Input too long");
    }

    const navigationPattern = /[a-zA-Z0-9]+\/navigation\/[a-zA-Z0-9]+/;
    const prefix = getUrlPrefix();

    if (navigationPattern.test(url)) {
      const newUrl = url.split("/").slice(1);
      return buildUrlPrefix(newUrl.join("/"), prefix).path;
    }

    return url;
  };

  return {
    resolveUrl,
    getUrlPrefix,
  };
}
