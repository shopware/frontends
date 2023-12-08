/**
 * Get current prefix
 *
 * @param {string[]} locales available locales
 * @param {string} name name from routing
 * @param {string} fallbackLocale default locale code
 * @returns {string} current prefix
 */
export function getPrefix(
  locales: string[],
  name: string,
  fallbackLocale: string,
): string {
  if (name.includes(fallbackLocale)) return "";
  const index = locales.findIndex((element) => name.includes(element));
  return index >= 0 ? locales[index] : "";
}
