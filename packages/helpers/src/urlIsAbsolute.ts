export function urlIsAbsolute(url: string) {
  return new RegExp("^(?:[a-z+]+:)?//", "i").test(url);
}
