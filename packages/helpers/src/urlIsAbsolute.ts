export function urlIsAbsolute(url: string) {
  return /^(?:[a-z+]+:)?\/\//i.test(url);
}
