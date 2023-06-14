export default function buildUrlPrefix(url: string | any, prefix: string) {
  if (typeof url === "string") {
    return prefix ? `/${prefix}${url}` : url;
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url;
}
