import { urlIsAbsolute } from "../urlIsAbsolute";

export function buildUrlPrefix(
  url: string | { path?: string },
  prefix: string,
): string {
  if (typeof url === "string") {
    if (urlIsAbsolute(url)) return url;
    url = url[0] !== "/" ? `/${url}` : url;
    return prefix ? `/${prefix}${url}` : url;
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url && url.path ? url.path : "";
}
