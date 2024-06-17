import { useContext, useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";
import type { Ref } from "vue";
import { urlIsAbsolute } from "@shopware-pwa/helpers-next";

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
   * @returns {Promise<operations['readLanguages post /language']['body']>} list of languages
   */
  getAvailableLanguages(): Promise<
    operations["readLanguages post /language"]["response"]
  >;
  /**
   * Change current language
   *
   * @param {string} languageId
   * @returns {Promise<Schemas['ContextTokenResponse']>} context object
   */
  changeLanguage(
    languageId: string,
  ): Promise<operations["updateContext patch /context"]["response"]>;
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
  languages: Ref<Schemas["Language"][]>;
  /**
   * Currently used language
   */
  currentLanguage: Ref<string>;
  /**
   * Current prefix from the context
   */
  currentPrefix: Ref<string>;
  /**
   * Add prefix to the Url
   * @param {string | RouteObject} link
   */
  formatLink(link: string | RouteObject): string | RouteObject;
};

export type RouteObject = {
  path: string;
  [key: string]: unknown;
};

/**
 * Composable for internationalization management.
 * @public
 * @category Context & Language
 */
export function useInternationalization(
  pathResolver?: (path: string) => string,
): UseInternationalizationReturn {
  const { devStorefrontUrl } = useShopwareContext();
  const { apiClient } = useShopwareContext();

  const _storeLanguages = useContext<Schemas["Language"][]>("swLanguages");
  const _storeCurrentLanguage = useContext<string>(
    "swLanguagesCurrentLanguage",
  );
  const _storeCurrentPrefix = useContext<string>("swLanguagesCurrentPrefix");

  function getStorefrontUrl() {
    return devStorefrontUrl ?? window.location.origin ?? "";
  }

  async function getAvailableLanguages() {
    const { data } = await apiClient.invoke("readLanguages post /language");
    _storeLanguages.value = data.elements;
    return data;
  }

  async function changeLanguage(languageId: string) {
    const { data } = await apiClient.invoke("updateContext patch /context", {
      body: { languageId },
    });
    return data;
  }

  function getLanguageCodeFromId(languageId: string) {
    return (
      _storeLanguages.value.find((element) => element?.id === languageId)
        ?.translationCode?.code || ""
    );
  }

  function getLanguageIdFromCode(languageCode: string) {
    return (
      _storeLanguages.value.find(
        (element) => element.translationCode?.code === languageCode,
      )?.id || ""
    );
  }

  function replaceToDevStorefront(url: string) {
    const current = new URL(url);
    return devStorefrontUrl
      ? url.replace(`${current.protocol}//${current.host}`, devStorefrontUrl)
      : url;
  }

  function formatLink(link: string | RouteObject) {
    if (!pathResolver) return link;

    if (typeof link === "string") {
      if (urlIsAbsolute(link)) return link;
      return pathResolver(link);
    }

    if (link.path) {
      link.path = pathResolver(link.path);
      return link;
    }

    return link;
  }

  return {
    getAvailableLanguages,
    getStorefrontUrl,
    changeLanguage,
    getLanguageCodeFromId,
    getLanguageIdFromCode,
    replaceToDevStorefront,
    formatLink,
    languages: _storeLanguages,
    currentLanguage: _storeCurrentLanguage,
    currentPrefix: _storeCurrentPrefix,
  };
}
