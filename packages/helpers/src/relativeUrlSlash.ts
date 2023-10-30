/**
 * Add/remove slash from the relative path
 *
 * @param {string} relativeUrl
 * @param {boolean} slash
 */
export function relativeUrlSlash(relativeUrl: string, slash: boolean = true) {
  const hasUrlSlash = relativeUrl.indexOf("/") === 0 ? true : false;

  if (slash) {
    return hasUrlSlash ? relativeUrl : `/${relativeUrl}`;
  }

  return hasUrlSlash ? relativeUrl.substring(1) : relativeUrl;
}
