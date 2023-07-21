export default function getUrlPrefix(url: string) {
  return new RegExp("^(?:[a-z+]+:)?//", "i").test(url);
}
