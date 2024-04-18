/**
 * Add/remove slash from the relative path
 *
 * @param {string} relativeUrl
 * @param {boolean} slash
 */
export function relativeUrlSlash(relativeUrl: string, slash = true) {
  const hasUrlSlash = relativeUrl.indexOf("/") === 0;

  if (slash) {
    return hasUrlSlash ? relativeUrl : `/${relativeUrl}`;
  }

  return hasUrlSlash ? relativeUrl.substring(1) : relativeUrl;
}
