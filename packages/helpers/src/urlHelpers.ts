// biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
type SearchCriteria<T = unknown> = T & { [key: string]: any };

/**
 * @internal
 * @deprecated not used anymore, remove in v1.0
 */
// biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
export function _parseUrlQuery(query: any): SearchCriteria {
  // biome-ignore lint/suspicious/noExplicitAny: deprecated method, will be removed
  const searchCriteria: any = {};
  if (!query || typeof query !== "object") {
    return searchCriteria;
  }

  // biome-ignore lint/complexity/noForEach: deprecated method, will be removed
  Object.keys(query).forEach((key: string) => {
    try {
      searchCriteria[key] =
        typeof query[key] === "string" &&
        ["{", "["].includes(query[key].charAt(0)) // it's a JSON
          ? JSON.parse(query[key])
          : query[key];
    } catch (e) {
      console.error(
        `[helpers][parseUrlQuery] Problem with resolving url param: ${key}`,
      );
    }
  });

  return searchCriteria;
}
