import { useShopwareContext } from "./useShopwareContext";

/**
 * interface for {@link useInternationalization} composable
 *
 * @beta
 */
export type UseInternationalization = {
  getStorefrontUrl: () => string;
};

/**
 * Composable for internationalization management. Options - {@link UseInternationalization}
 *
 * @beta
 */
export function useInternationalization(): UseInternationalization {
  /**
   * Should be removed after resolving backend multi domains problems
   */
  const { apiInstance } = useShopwareContext();

  /**
   * StorefrontUrl is needed to specify language of emails
   *
   * @returns string
   */
  const getStorefrontUrl = (): string => {
    /**
     * apiIntanceUrl - should be removed after resolving backend multi domains problems
     */
    const apiIntanceUrl = apiInstance.config.endpoint
      ? apiInstance.config.endpoint.slice(0, -1)
      : undefined;
    return apiIntanceUrl ?? window.location.origin ?? "";
  };

  return {
    getStorefrontUrl,
  };
}
