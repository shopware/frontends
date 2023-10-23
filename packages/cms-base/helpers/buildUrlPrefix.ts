export default function buildUrlPrefix(url: string | any, prefix: string) {
  url = url[0] !== "/" ? `/${url}` : url;

  if (typeof url === "string") {
    return prefix ? `/${prefix}${url}` : url;
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url;
}
