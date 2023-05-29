export default function getUrlPrefix(url: string | any) {
  const prefix = inject("urlPrefix", "");
  console.log("prefix", prefix);
  if (typeof url === "string") {
    return prefix ? `/${prefix}${url}` : url;
  }
  if (url.path && prefix) {
    url.path = `/${prefix}${url.path}`;
  }

  return url;
}
