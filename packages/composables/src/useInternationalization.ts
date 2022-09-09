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
   * StorefrontUrl is needed to specify language of emails
   *
   * @returns string
   */
  const getStorefrontUrl = (): string => {
    return window.location.origin ?? "";
  };

  return {
    getStorefrontUrl,
  };
}
