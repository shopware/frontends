import buildUrlPrefix from "./buildUrlPrefix";
import getUrlPrefix from "./getUrlPrefix";

export default function resolveUrl(url: string) {
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
}
