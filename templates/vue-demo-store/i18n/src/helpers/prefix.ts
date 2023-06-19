import i18nConfig from "../config";

/**
 * Get current prefix
 *
 * @param {string[]} locales available locales
 * @param {string} name name from routing
 * @returns {string} current prefix
 */
export function getPrefix(locales: string[], name: string): string {
  if (name.includes(i18nConfig.defaultLocale)) return "";
  const index = locales.findIndex((element) => name.includes(element));
  return index >= 0 ? locales[index] : "";
}

/**
 * Get current language
 *
 * @returns {string}
 */
export function getDefaultLocale(): string {
  return i18nConfig.defaultLocale;
}
