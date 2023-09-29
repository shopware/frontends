export default defineNuxtConfig({
  modules: ["../src/module"],
  adyenCheckout: {
    environment: "test", // Change to 'live' for the live environment.
    clientKey: "test_870be2...", // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
    analytics: {
      enabled: true, // Set to false to not send analytics data to Adyen.
    },
    session: {
      id: "CSD9CAC3...", // Unique identifier for the payment session.
      sessionData: "Ab02b4c...", // The payment session data.
    },
    onPaymentCompleted: (result, component) => {
      console.info(result, component);
    },
    onError: (error, component) => {
      console.error(error.name, error.message, error.stack, component);
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
  },
  devtools: { enabled: true },
});
