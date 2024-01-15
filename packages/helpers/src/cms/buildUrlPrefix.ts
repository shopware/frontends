import { urlIsAbsolute } from "../urlIsAbsolute";

type UrlRoute = {
  path?: string;
  state?: {
    routeName?: string;
    foreignKey?: string;
  };
};

type UrlRouteOutput = Omit<UrlRoute, "path"> & { path: string };

export function buildUrlPrefix(
  url: string | UrlRoute,
  prefix: string,
): UrlRouteOutput {
  if (typeof url === "string") {
    if (urlIsAbsolute(url)) return { path: url };
    url = url[0] !== "/" ? `/${url}` : url;
    return { path: prefix ? `/${prefix}${url}` : url };
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url.path && typeof url.path === "string"
    ? (url as UrlRouteOutput)
    : { path: "" };
}
