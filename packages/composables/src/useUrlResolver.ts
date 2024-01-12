import { inject } from "vue";
import { buildUrlPrefix } from "@shopware-pwa/helpers-next";

export function useUrlResolver() {
  const getUrlPrefix = () => {
    try {
      return inject("urlPrefix", "");
    } catch ($error) {
      return "";
    }
  };

  const resolveUrl = (url: string) => {
    const navigationPattern = /[a-zA-z0-9]+\/navigation\/[a-zA-z0-9]+/;
    const urlPrefix = getUrlPrefix();

    switch (true) {
      case navigationPattern.test(url):
        // Remove first lang segment of the URL
        const newUrl = url.split("/").slice(1);
        return newUrl ? `${buildUrlPrefix(newUrl.join("/"), urlPrefix)}` : url;
      default:
        return url;
    }
  };

  return {
    resolveUrl,
    getUrlPrefix,
  };
}
