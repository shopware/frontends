import { useShopwareContext } from "./useShopwareContext";
import { getAvailableLanguages as getAvailableLanguagesAPI } from "@shopware-pwa/api-client";
import { _useContext } from "./internal/_useContext";

import { setCurrentLanguage } from "@shopware-pwa/api-client";

export type UseInternationalizationReturn = {
  /**
   * StorefrontUrl is needed to specify language of emails
   */
  getStorefrontUrl(): string;
  getAvailableLanguages(): any;
  changeLanguage(languageId: string): Promise<void>;
  getLanguageCodeFromId(languageId: string): string;
  languages: any;
  currentLanguage: any;
};

/**
 * Composable for internationalization management.
 * @public
 * @category Context & Language
 */
export function useInternationalization(): UseInternationalizationReturn {
  const { devStorefrontUrl } = useShopwareContext();
  const { apiInstance } = useShopwareContext();

  const _storeLanguages = _useContext<any>("swLanguages");
  const _storeCurrentLanguage = _useContext<any>("swLanguagesCurrentLanguage");

  function getStorefrontUrl() {
    return devStorefrontUrl ?? window.location.origin ?? "";
  }

  async function getAvailableLanguages() {
    const data = await getAvailableLanguagesAPI(apiInstance);
    _storeLanguages.value = data.elements;
    return data;
  }

  async function changeLanguage(languageId: string) {
    await setCurrentLanguage(languageId, apiInstance);
  }

  function getLanguageCodeFromId(languageId: string) {
    console.log("language.id", languageId);
    console.log(
      "oooo",
      _storeLanguages.value.find((element: any) => element.id === languageId)
    );
    return _storeLanguages.value.find(
      (element: any) => element.id === languageId
    )?.translationCode.code;
  }

  return {
    getAvailableLanguages,
    getStorefrontUrl,
    changeLanguage,
    getLanguageCodeFromId,
    languages: _storeLanguages,
    currentLanguage: _storeCurrentLanguage,
  };
}
