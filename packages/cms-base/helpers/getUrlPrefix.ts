export default function getUrlPrefix(url: string | any) {
  const prefix = inject("urlPrefix", "");
  if (typeof url === "string") {
    return prefix ? `/${prefix}${url}` : url;
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url;
}
