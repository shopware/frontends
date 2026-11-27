export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "../src/module"], // path to amazon-pay module
  runtimeConfig: {
    shopware: {
      endpoint: "https://demo-frontends.shopware.store/store-api",
      accessToken: "SWSCUJQXHJNQXKJAFVJFZLJQXH",
    },
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
          // Shopware 6 Admin API integration credentials. Never commit them:
          // leave these empty and set them through environment variables
          // (see .env.example). They stay in private runtimeConfig and are
          // read only by the server routes.
          // NUXT_AMAZON_PAY_SHOPWARE_ADMIN_API_CREDENTIALS_CLIENT_ID
          client_id: "",
          // NUXT_AMAZON_PAY_SHOPWARE_ADMIN_API_CREDENTIALS_CLIENT_SECRET
          client_secret: "",
        },
      },
    },
  },
  devtools: { enabled: true },
});
