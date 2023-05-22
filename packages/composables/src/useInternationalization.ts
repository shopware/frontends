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
  languages: any;
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

  function getStorefrontUrl() {
    return devStorefrontUrl ?? window.location.origin ?? "";
  }

  async function getAvailableLanguages() {
    const data = await getAvailableLanguagesAPI(apiInstance);
    _storeLanguages.value = data.elements;
    return data;
  }

  async function changeLanguage(languageId: any) {
    await setCurrentLanguage(languageId, apiInstance);
  }

  return {
    getAvailableLanguages,
    getStorefrontUrl,
    changeLanguage,
    languages: _storeLanguages,
  };
}
