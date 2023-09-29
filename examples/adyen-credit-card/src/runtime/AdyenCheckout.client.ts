import { defineNuxtPlugin } from "#app";
import AdyenCheckout from "@adyen/adyen-web";

const configuration = {
  environment: "test", // Change to 'live' for the live environment.
  clientKey: "test_870be2...", // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
  analytics: {
    enabled: true, // Set to false to not send analytics data to Adyen.
  },
  // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
  // For example, this is 3D Secure configuration for cards:
  paymentMethodsConfiguration: {
    card: {
      hasHolderName: true,
      holderNameRequired: true,
      billingAddressRequired: true,
    },
  },
};

export default defineNuxtPlugin(async () => {
  const checkout = await AdyenCheckout(configuration);

  return {
    provide: {
      adyenCheckout: checkout,
    },
  };
});
