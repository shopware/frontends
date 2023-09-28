<script setup lang="ts">
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
const configuration = {
  environment: "test", // Change to 'live' for the live environment.
  //clientKey: 'test_870be2...', // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
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
const checkout = await AdyenCheckout(configuration);

// Access the available payment methods for the session.
console.log(checkout.paymentMethodsResponse); // => { paymentMethods: [...], storedPaymentMethods: [...] }

onMounted(() => {
  // Create an instance of the Component and mount it to the container you created.
  checkout.create("card").mount("#adyen-credit-card");
});
</script>
<template>
  <div id="adyen-credit-card" />
</template>
