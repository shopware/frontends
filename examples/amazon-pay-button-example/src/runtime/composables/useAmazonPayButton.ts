import { useRuntimeConfig, useSessionContext } from "#imports";

/**
 * Composable for rendering the Amazon Pay button
 */
export function useAmazonPayButton(
  elementId: string,
  options: {
    productType: "PayOnly" | "AuthorizeAndPay" | "PayAndShip";
    placement: "Cart" | "Product" | "Checkout";
    buttonColor: "Gold" | "DarkGrey" | null;
    locale: "en_GB" | "en_US" | "de_DE";
  },
) {
  const { currency } = useSessionContext();

  const nuxtConfig = useRuntimeConfig().public.amazonPay;

  /**
   * Mount the Amazon Pay button
   */
  const mount = async () => {
    // get init session config
    const data = await fetch("/api/amazon-pay/init");
    const config = await (await data.json()).result;

    // render the Amazon Pay button for given elementId
    window?.amazon?.Pay.renderButton(elementId, {
      merchantId: nuxtConfig?.merchantId,
      ledgerCurrency: currency.value?.isoCode,
      sandbox: nuxtConfig?.sandbox,
      checkoutLanguage: options.locale,
      productType: options.productType,
      placement: options.placement,
      buttonColor: options.buttonColor,
      createCheckoutSessionConfig: config,
    });
  };

  return {
    mount,
  };
}

/**
 * Extend the window object to declare the Amazon Pay button render function
 * for script loaded globally in the browser
 */
declare global {
  interface Window {
    amazon: {
      Pay: {
        renderButton: (elementId: string, options: unknown) => void;
      };
    };
  }
}
