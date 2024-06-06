export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next/nuxt-layer"],
  modules: ["@shopware-pwa/nuxt3-module", "../src/module"], // path to amazon-pay module
  amazonPay: {
    storeId:
      "YOUR STORE ID HERE (e.g. amzn1.application-oa2-client.0123456789abcdef...)", // from amazon pay panel
    publicKeyId: "YOUR PUBLIC KEY ID", // from amazon pay panel
    merchantId: "YOUR MERCHANT ID", // from amazon pay panel
    privateKeyPath:
      "relative path to your private key (e.g ./server/private.pem)", // from amazon pay panel
    region: "DE", // region of your store
    sandbox: true, // whether to use the sandbox environment
    algorithm: "AMZN-PAY-RSASSA-PSS-V2", // algorithm to use
    webCheckoutDetails: {
      checkoutReviewReturnUrl:
        "PUT YOUR REVIEW URL HERE (e.g. https://frontends-demo.vercel.app/checkout)", // registered in amazon pay panel
      checkoutResultReturnUrl:
        "PUT YOUR RESULT URL HERE (e.g. https://frontends-demo.vercel.app/checkout/success)", // registered in amazon pay panel
    },
    shopwareAdminApi: {
      endpoint:
        "Shopware 6 Admin API endpoint (e.g https://demo-frontends.shopware.store/api)",
      credentials: {
        // credentials for the Shopware 6 Admin API
        client_id: "SWIABTJARFASQLD5SGS0BVVOZG",
        client_secret: "QUhPMHlPbF2Cvxnc2eG5XN1NCRDhBRU55TEhWV05qQm50MEowTXU",
      },
    },
  },
  devtools: { enabled: true },
});
