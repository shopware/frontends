import { useShopwareContext } from "./useShopwareContext";

export type UseInternationalizationReturn = {
  /**
   * StorefrontUrl is needed to specify language of emails
   */
  getStorefrontUrl: () => string;
};

/**
 * Composable for internationalization management. Options - {@link UseInternationalizationReturn
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
    const apiIntanceUrl = apiInstance.config.endpoint
      ? apiInstance.config.endpoint.slice(0, -1)
      : undefined;
    return apiIntanceUrl ?? window.location.origin ?? "";
  }

  return {
    getStorefrontUrl,
  };
}
