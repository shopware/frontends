import { useShopwareContext } from "./useShopwareContext";
import { getAvailableLanguages as getAvailableLanguagesAPI } from "@shopware-pwa/api-client";
import { _useContext } from "./internal/_useContext";
import {
  Language,
  ContextTokenResponse,
  EntityResult,
} from "@shopware-pwa/types";
import { setCurrentLanguage } from "@shopware-pwa/api-client";
import { Ref } from "vue";
export type UseInternationalizationReturn = {
  /**
   * StorefrontUrl is needed to specify language of emails
   *
   *  @returns {string} storefront URL
   */
  getStorefrontUrl(): string;
  /**
   * Get available languages from backend
   *
   * @returns {Promise<EntityResult<"language", Language>>} list of languages
   */
  getAvailableLanguages(): Promise<EntityResult<"language", Language>>;
  /**
   * Change current language
   *
   * @param {string} languageId
   * @returns {Promise<ContextTokenResponse>} context object
   */
  changeLanguage(languageId: string): Promise<ContextTokenResponse>;
  /**
   * Get language code from backend language id
   *
   * @param {string} languageId
   * @returns {string} language code
   */
  getLanguageCodeFromId(languageId: string): string;
  /**
   * Get backend language id from language code
   *
   * @param {string} languageCode
   * @returns {string} language
   */
  getLanguageIdFromCode(languageCode: string): string;
  /**
   * Replace to dev url if it is set
   *
   * @param {string} url
   * @returns {string} prefixed url
   */
  replaceToDevStorefront(url: string): string;
  /**
   * List of available languages
   */
  languages: Ref<Language[]>;
  /**
   * Currently used language
   */
  currentLanguage: Ref<string>;
  /**
   * Current prefix from the context
   */
  currentPrefix: Ref<string>;
};

/**
 * Composable for internationalization management.
 * @public
 * @category Context & Language
 */
export function useInternationalization(): UseInternationalizationReturn {
  const { devStorefrontUrl } = useShopwareContext();
  const { apiInstance } = useShopwareContext();

  const _storeLanguages = _useContext<Language[]>("swLanguages");
  const _storeCurrentLanguage = _useContext<string>(
    "swLanguagesCurrentLanguage",
  );
  const _storeCurrentPrefix = _useContext<string>("swLanguagesCurrentPrefix");

  function getStorefrontUrl() {
    return devStorefrontUrl ?? window.location.origin ?? "";
  }

  async function getAvailableLanguages() {
    const data = await getAvailableLanguagesAPI(apiInstance);
    _storeLanguages.value = data.elements;
    return data;
  }

  function changeLanguage(languageId: string) {
    return setCurrentLanguage(languageId, apiInstance);
  }

  function getLanguageCodeFromId(languageId: string) {
    return (
      _storeLanguages.value.find((element: any) => element?.id === languageId)
        ?.translationCode?.code || ""
    );
  }

  function getLanguageIdFromCode(languageCode: string) {
    return (
      _storeLanguages.value.find(
        (element: any) => element?.translationCode.code === languageCode,
      )?.id || ""
    );
  }

  function replaceToDevStorefront(url: string) {
    const current = new URL(url);
    return devStorefrontUrl
      ? url.replace(`${current.protocol}//${current.host}`, devStorefrontUrl)
      : url;
  }

  return {
    getAvailableLanguages,
    getStorefrontUrl,
    changeLanguage,
    getLanguageCodeFromId,
    getLanguageIdFromCode,
    replaceToDevStorefront,
    languages: _storeLanguages,
    currentLanguage: _storeCurrentLanguage,
    currentPrefix: _storeCurrentPrefix,
  };
}
