import { Language } from "@shopware-pwa/types";

/**
 * Get translated language name
 *
 * @param {Language} language
 * @returns {string}
 */
export function getLanguageName(language: Language): string {
  return language.translationCode?.translated?.name || "";
}
