import { buildUrlPrefix, urlIsAbsolute } from "@shopware/helpers";

const MAX_URL_LENGTH = 2083;
const NAVIGATION_PATTERN = /[a-zA-Z0-9]+\/navigation\/[a-zA-Z0-9]+/;

export function resolveCmsUrl(url: string, urlPrefix: string): string {
  if (url.length > MAX_URL_LENGTH) {
    throw new Error("URL Input too long");
  }
  if (NAVIGATION_PATTERN.test(url)) {
    const withoutFirstSegment = url.split("/").slice(1).join("/");
    return buildUrlPrefix(withoutFirstSegment, urlPrefix).path;
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
