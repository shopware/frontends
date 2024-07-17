/**
 * Get translated language name
 *
 * @param {Language} language
 * @returns {string}
 */
export function getLanguageName<
  T extends {
    translationCode?: { translated: { name: string } };
  },
>(language: T): string {
  return language.translationCode?.translated.name || "";
}
