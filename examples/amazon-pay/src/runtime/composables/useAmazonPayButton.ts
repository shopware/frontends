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
  },
) {
  const { currency } = useSessionContext();
  const { locale } = useI18n();

  const nuxtConfig = useRuntimeConfig().public.amazonPay;

  const mount = async () => {
    console.warn("mounting a button");
    const data = await fetch("/api/amazon-pay/init");
    const config = await(await data.json()).result;
    console.warn("rendering a button", {
      merchantId: nuxtConfig?.merchantId,
      ledgerCurrency: currency.value?.isoCode,
      sandbox: nuxtConfig?.sandbox,
      checkoutLanguage: locale.value.replace("-", "_") || "en_GB",
      productType: options.productType,
      placement: options.placement,
      buttonColor: options.buttonColor,
      createCheckoutSessionConfig: config,
    });
    window?.amazon?.Pay.renderButton(elementId, {
      merchantId: nuxtConfig?.merchantId,
      ledgerCurrency: currency.value?.isoCode,
      sandbox: nuxtConfig?.sandbox,
      checkoutLanguage: locale.value.replace("-", "_") || "en_GB",
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
