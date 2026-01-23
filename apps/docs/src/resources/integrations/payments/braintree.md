---
head:
  - - meta
    - name: og:title
      content: "Braintree Integration"
  - - meta
    - name: og:description
      content: "Learn how to integrate Braintree payments in a headless Shopware frontend using the official Braintree App."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Braintree.png"
---

# Braintree Integration

:::tip Advanced Guide - prior knowledge required
In order to follow this guide properly, we recommend that you get familiar with the payment flow and payment API concepts first.

- [Payment Flow in Shopware 6](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments)
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)
  :::

This guide shows how to integrate **Braintree Credit Card** payments using the [Shopware Braintree App](https://github.com/shopware/braintree-app) in a headless frontend.

## Prerequisites

- Shopware 6 instance with the [Braintree App](https://github.com/shopware/braintree-app) installed and configured
- Braintree payment method enabled in your sales channel
- Customer account with valid billing/shipping address

## Install dependencies

```bash
npm install braintree-web-drop-in
```

## Integration Flow

The Braintree App integration requires three steps:

1. Get a client token from Shopware's App System
2. Initialize the Braintree Drop-in UI
3. Create order and handle payment with the nonce

## Step 1: Get Client Token

First, obtain an app token from Shopware, then exchange it for a Braintree client token.

```ts
const { apiClient } = useShopwareContext();
const { sessionContext } = useSessionContext();

// Get app token from Shopware Store-API
const tokenResponse = await apiClient.invoke(
  "generateJWTAppSystemAppServer post /app-system/{name}/generate-token",
  { pathParams: { name: "SwagBraintreeApp" } },
);
const { token, shopId } = tokenResponse.data;

// Get Braintree client config from the app server
const currencyId = sessionContext.value?.currency?.id;
const salesChannelId = sessionContext.value?.salesChannel?.id;

const configResponse = await fetch(
  `https://braintree.shopware.com/api/client/config?shop-id=${shopId}&currency-id=${currencyId}&sales-channel-id=${salesChannelId}`,
  {
    method: "POST",
    headers: {
      "shopware-app-token": token,
      "shopware-app-shop-id": shopId,
    },
  },
);
const { clientToken } = await configResponse.json();
```

:::warning Important
Use the `shopware-app-token` header, **NOT** `Authorization: Bearer`. Using the wrong header format will result in 500 errors.
:::

## Step 2: Initialize Braintree Drop-in

```ts
import dropin from "braintree-web-drop-in";

const instance = await dropin.create({
  authorization: clientToken,
  container: "#dropin-container",
  dataCollector: true, // Required for deviceData (fraud detection)
  card: {
    cardholderName: {
      required: true,
    },
  },
});
```

## Step 3: Create Order and Handle Payment

When the user submits payment, get the nonce from the Drop-in, create the order, then call `/handle-payment` with the Braintree data.

```ts
const { createOrder } = useCheckout();
const { apiClient } = useShopwareContext();

async function onPaymentSubmit() {
  // Get nonce from Braintree Drop-in
  const { nonce, deviceData } = await instance.requestPaymentMethod();

  // Create order (no braintree params here)
  const order = await createOrder();

  // Handle payment WITH Braintree data
  await apiClient.invoke("handlePaymentMethod post /handle-payment", {
    body: {
      orderId: order.id,
      finishUrl: `${window.location.origin}/checkout/finish`,
      errorUrl: `${window.location.origin}/checkout/error`,
      braintreeNonce: nonce,
      braintreeDeviceData: deviceData,
    },
  });
}
```

:::warning Important
Pass `braintreeNonce` and `braintreeDeviceData` to `/handle-payment`, **NOT** to `/checkout/order`.
:::

## Test Cards

For Braintree sandbox testing:

| Card Type | Number              | Expiry     | CVV |
| --------- | ------------------- | ---------- | --- |
| Visa      | 4111 1111 1111 1111 | Any future | Any |

## Working Example

See the complete working example in the Composable Frontends repository:

[Braintree Credit Card Example](https://github.com/shopware/frontends/tree/main/examples/braintree-credit-card)

## Resources

- [Shopware Braintree App](https://github.com/shopware/braintree-app)
- [Braintree App Wiki - Headless Integration](https://github.com/shopware/braintree-app/wiki/3.-Headless-integration)
- [Braintree Web Drop-in](https://github.com/braintree/braintree-web-drop-in)
- [Braintree Developer Docs](https://developer.paypal.com/braintree/docs)
