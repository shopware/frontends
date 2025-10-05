# Toolset to manage Amazon Pay

The example shows how to embed Amazon Pay button even without fully integrated backend (see 😇 [**_Bypassing a plugin_**](#bypassing-a-plugin) chapter in the bottom to check what it is about).

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ &nbsp;`amazon-pay` plugin to add amazon pay script to the DOM
- 🚠 &nbsp;`AmazonPayButton.client.vue` component to use in a Vue project
- 🌅 &nbsp;`useAmazonPayButton` composable function to manage a button mounting
- 🛤️ &nbsp;`useAmazonPayCheckout` composable function to process the checkout flow

## Requirements

- A basic knowledge of [Amazon Pay](https://developer.amazon.com/docs/amazon-pay-checkout/introduction.html) official documentation - thanks to this, you will understand the further configuration and potential issues
- [Amazon Pay App](https://store.shopware.com/en/swag117522576433f/amazon-pay.html) installed in your shop
- Some Nuxt.js project

## Setup

### Amazon

Prepare your Amazon Pay integration, you will need:

- storeId
- publicKeyId
- private key (do not version it!)
- merchantId

Also, there will be a step to define return URLs like: `checkoutReviewReturnUrl` or `checkoutResultReturnUrl`. That URLs should match the routes in your nuxt application as you will be redirected there to proceed the amazon pay flow (redirection with `amazonCheckoutSessionId` query param).

### Backend

- Make sure that Amazon Pay payment method is enabled and available in your sales channel.

- Set up [Client Credentials](https://shopware.stoplight.io/docs/admin-api/8e1d78252fa6f-authentication#client-credentials) grant type for Admin API communication - **read and update rights for order transactions**

### Frontend: Nuxt 3 project

0. Install the dependencies

   run `pnpm i` command.

   Note that if you are starting from scratches (not using this example as it is) you will probably need as minimum:

   - [@shopware/nuxt-module](https://www.npmjs.com/package/@shopware/nuxt-module) - sets up your project to be Shopware 6 aware
   - [@shopware/composables](https://www.npmjs.com/package/@shopware/composables) - installs all the dependencies for the logic layer
   - [@shopware/api-client](https://www.npmjs.com/package/@shopware/api-client) - API client for your REST API Shopware 6 backend
   - [@amazonpay/amazon-pay-api-sdk-nodejs](https://www.npmjs.com/package/@amazonpay/amazon-pay-api-sdk-nodejs) - nodejs client for Amazon Pay API

1. Register the module in your Nuxt 3 project

```js
  // ./playground/nuxt.config.ts
  modules: ["@shopware/nuxt-module", "../src/module"],
  // see that "../src/module" points to this dir (from ./playground/nuxt.config.ts file)
```

2. Setup nuxt project

```ts
// ./nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "../src/module"], // path to amazon-pay module
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
        // credentials for the Shopware 6 Admin API (the same generated in **Backend** chapter above)
        client_id: "SWIABTJARFASQLD5SGS0BVVOZG",
        client_secret: "QUhPMHlPbF2Cvxnc2eG5XN1NCRDhBRU55TEhWV05qQm50MEowTXU",
      },
    },
  },
});
```

## Use Amazon Pay component

Use `<AmazonPayButton />` component wherever you want as it's registered globally. You can customize the way it's rendered by editing the component `src/runtime/components/AmazonPayButton.client.vue`.

## What to expect

- If Amazon Pay script is loaded properly and the configuration is correct, you should see the rendered Amazon Pay button.
- When you click the button, there will be redirection to the Amazon Pay gateway to sign in.
- Regardless the result, you will be redirected back to the URL defined your `nuxt.config` file, under `checkoutReviewReturnUrl` value.

## Capture the session and use the Amazon Pay data

the route, defined under `checkoutReviewReturnUrl` should be now the place where the session can be captured, because of session id in the query

### Auto register and sign-in

```ts
const {
  registerCustomerFromAmazonSession,
  setAmazonPaymentMethod,
  isAmazonPay,
  createOrderAndCharge,
} = useAmazonPayCheckout();
// useAmazonPayCheckout function reads the query from the URL and finds the Amazon Pay checkout ID

onMounted(async () => {
  // already logged-in? ignore further steps
  if (isLoggedIn.value || isGuestSession.value) {
    return;
  }
  // try to register a customer - use the buyer name, email, address and so on provided by Amazon Pay
  await registerCustomerFromAmazonSession();
  // optionally, set the payment method to be Amazon Pay
  await setAmazonPaymentMethod();
});
```

### Place the order and update the payment intent in Amazon Pay

Conditionally, if the Amazon Pay session is detected - create order using `createOrderAndCharge` function of `useAmazonPayCheckout` composable. Thanks to this, you will be redirected to the Amazon Pay gateway to complete the payment process.

```ts
if (isAmazonPay.value) {
  const orderResponse = await createOrderAndCharge();
  const redirectUrl =
    orderResponse?.result?.webCheckoutDetails?.amazonPayRedirectUrl;
  // Redirect to Amazon Pay
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
} else {
  const order = await createOrder();
  await push("/checkout/success/" + order.id);
}
```

## Complete the payment flow

If the payment succeeds, you will be redirected back to the `checkoutResultReturnUrl` URL defined in `nuxt.config` file. Then you can read the session again to complete the payment:

```ts
const { complete } = useAmazonPayCheckout();

await complete();
```

Once it's done, the order's transaction is marked as **paid** and Amazon Pay service gets the same information.

This is also the right place to add some additional security / anti fraud checks - [see the source code](./src/runtime/server/api/amazon-pay/complete.post.ts).

## Bypassing a plugin

The main goal was to show how to do the standard plugin's jobs:

- get the redirection URL to the payment gateway
- update the payment status
- Capture the payment

In this case, the app still does not support fully integration for headless approach, that's why some server API routes were required to make it works as expected:

- ✅ keep credentials in secret
- ✅ take over the communication between frontend and Amazon Pay services
- ✅ communicate with Shopware 6 Admin API using [@shopware/api-client](https://www.npmjs.com/package/@shopware/api-client) package (see [complete.post.ts](./src/runtime/server/api/amazon-pay/complete.post.ts) file).

## Resources

- [📖 &nbsp;Composable Frontends Documentation](https://frontends.shopware.com)
- [Amazon Pay docs](https://developer.amazon.com/docs/amazon-pay-checkout/introduction.html)
- [Setting up the Shopware 6 Admin API client](https://www.npmjs.com/package/@shopware/api-client#admin-api-client-setup)
