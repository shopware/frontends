import { urlIsAbsolute } from "../urlIsAbsolute";
export function buildUrlPrefix(url: string | object, prefix: string) {
  if (typeof url === "string") {
    if (urlIsAbsolute(url)) return url;
    url = url[0] !== "/" ? `/${url}` : url;
    return prefix ? `/${prefix}${url}` : url;
  }
  // @ts-expect-error: Get rid of any and use a proper object type
  if (url.path && prefix) {
    // @ts-expect-error: Get rid of any and use a proper object type
    url.path = `/${prefix}${url.path}`;
  }

  return url;
}
