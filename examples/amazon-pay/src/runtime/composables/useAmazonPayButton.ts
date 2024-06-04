import { useSessionContext, useRuntimeConfig } from "#imports";
declare global {
  interface Window {
    amazon: {
      Pay: {
        renderButton: (elementId: string, options: unknown) => void;
      };
    };
  }
}

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

  const mount = async () => {
    const data = await fetch("/api/amazon-pay/init");
    const config = await (await data.json()).result;
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
