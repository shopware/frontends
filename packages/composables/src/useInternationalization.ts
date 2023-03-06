import { useShopwareContext } from "./useShopwareContext";

export type UseInternationalizationReturn = {
  /**
   * StorefrontUrl is needed to specify language of emails
   */
  getStorefrontUrl: () => string;
};

/**
 * Composable for internationalization management.
 * @public
 * @category Context & Language
 */
export function useInternationalization(): UseInternationalizationReturn {
  /**
   * Should be removed after resolving backend multi domains problems
   */
  const { apiInstance } = useShopwareContext();

  function getStorefrontUrl() {
    /**
     * apiIntanceUrl - should be removed after resolving backend multi domains problems
     */
    return apiInstance.config.endpoint ?? window.location.origin ?? "";
  }

  return {
    getStorefrontUrl,
  };
}
