---
head:
  - - meta
    - name: og:title
      content: "ShopwarePayments Integration"
  - - meta
    - name: og:description
      content: "Integrate PayPal, Pay Later, Apple Pay, Google Pay, and card fields with the ShopwarePayments browser library."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/ShopwarePayments.png"
---

# ShopwarePayments

:::tip Advanced Guide - prior knowledge required
In order to follow this guide properly, we recommend that you get familiar with the payment flow and payment API concepts first.

- [Payment Flow in Shopware 6](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments)
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)
  :::

This guide shows how to integrate ShopwarePayments in a headless storefront with the `shopware-payments.js` library. The library renders PayPal, Pay Later, Apple Pay, Google Pay, and card fields, and it creates the provider order. Your storefront keeps the cart, the customer, shipping, and the Shopware order.

The [PayPal integration](./paypal.html) covers the separate SwagPayPal extension. ShopwarePayments uses the browser library on this page.

## Prerequisites

Install ShopwarePayments and enable the payment methods for the sales channel. Before rendering a button or card field, select the matching ShopwarePayments method on the shopper context. `buttons()`, `applePay()`, and `googlePay()` leave that selection unchanged. When the Shopware order already exists, its transaction has to use the same method.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/select-payment-method.ts" code lang="ts" no-name -->

```ts
import { useSessionContext } from "#imports";

const { setPaymentMethod } = useSessionContext();

// Store API id of the ShopwarePayments method for this surface:
// PayPal, Pay Later, Apple Pay, Google Pay, or card.
const paymentMethodId = "SHOPWARE_PAYMENTS_METHOD_ID";

await setPaymentMethod({ id: paymentMethodId });
```

<!-- /automd -->

## Load the library

Load the library with a `<script>` tag from either the production or the staging host:

- **Production:** `headless.shopware-payments.services.shopware.io`
- **Staging:** `headless.shopware-payments.staging-services.shopware.io`

Exact version URLs are immutable, while version aliases such as `/headless/{majorVersion}/` and `/headless/latest/` are updated with each release. Therefore, **Subresource Integrity (SRI) hashes should only be used with exact version URLs**.

**Note:** While the major version remains `0`, minor releases may introduce breaking changes.

`data-shop-id` is Shopware's app shop id (`core.app.shopIdV2` id, or `core.app.shopId` on older versions). `init({ shopId })` overrides the attribute when both are set.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/load-the-library.html" code lang="html" no-name -->

```html
<script
  src="https://headless.shopware-payments.services.shopware.io/headless/latest/shopware-payments.js"
  data-shop-id="YOUR_SHOP_ID"
  crossorigin="anonymous"
></script>
```

<!-- /automd -->

## Initialize

Call `window.ShopwarePayments.init()` after the script loads and keep the returned client. Pass the shopper's current Store API session:

| Option                  | Value                                                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storefrontUrl`         | Absolute Shopware base URL, including a language prefix or subdirectory. Remove a trailing `/store-api`. This is the Shopware instance, including the language prefix when the channel has one. |
| `salesChannelId`        | 32-character hexadecimal id of the same sales channel as the access key                                                                                                                         |
| `storeApi.accessKey`    | Sales channel Store API access key                                                                                                                                                              |
| `storeApi.contextToken` | Shopper's current `sw-context-token`                                                                                                                                                            |
| `currencyCode`          | Active currency ISO code, such as `EUR`                                                                                                                                                         |
| `shopId`                | App shop id. Optional when `data-shop-id` is set on the script                                                                                                                                  |

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/init.ts" code lang="ts" no-name -->

```ts
import { useRuntimeConfig, useSessionContext } from "#imports";

import type { ShopwarePaymentsClient } from "./snippet-context";

const runtimeConfig = useRuntimeConfig();
const { currency, sessionContext } = useSessionContext();

const endpoint = runtimeConfig.public.shopware?.endpoint;
const accessKey = runtimeConfig.public.shopware?.accessToken;
const context = sessionContext.value;
const salesChannelId = context?.salesChannel?.id;
const contextToken = context?.token;
const currencyCode = currency.value?.isoCode;

if (
  !endpoint ||
  !accessKey ||
  !salesChannelId ||
  !contextToken ||
  !currencyCode
) {
  throw new Error("Shopware session is not ready for ShopwarePayments");
}

const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL, including a language prefix or subdirectory.
    // Strip a trailing /store-api from the Nuxt endpoint.
    storefrontUrl: endpoint.replace(/\/store-api\/?$/, ""),
    salesChannelId,
    storeApi: {
      accessKey,
      contextToken,
    },
    currencyCode,
    shopId: "YOUR_SHOP_ID",
  });

export { shopwarePayments };
```

<!-- /automd -->

A resolved `init()` promise means the client can render payment UI. It has not placed a Shopware order. Catch the rejection and keep the payment UI hidden. Invalid options reject with `step: "init"`.

## Checkout payload

Every payment surface takes a `checkout` object. Pass the live cart and the sales channel context, or pass an existing Shopware order. Pass one of those two shapes. Include the nested prices, line items, deliveries, and customer data the Store API already returned, and keep the object current. An optional `returnUrl` is an absolute `http` or `https` URL.

The library uses this payload to create a **provider order** (the PayPal order). Your page still places the Shopware order after approval.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/checkout.ts" code lang="ts" no-name -->

```ts
import { useCart, useSessionContext } from "#imports";

import type { CartCheckout, PlacedOrderCheckout } from "./snippet-context";

const { cart } = useCart();
const { sessionContext } = useSessionContext();

const currentCart = cart.value;
const context = sessionContext.value;

if (!currentCart || !context) {
  throw new Error("Cart and session are required before rendering payment UI");
}

const cartCheckout: CartCheckout = {
  cart: currentCart,
  salesChannelContext: context,
};

function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
```

<!-- /automd -->

`placedOrderCheckout` is the path for an order that already exists, such as paying again from the customer account. Wallet and card setup reject subscription data with `UNSUPPORTED_CAPABILITY`.

## Approve the payment

`onApprove` runs after the shopper approves the provider order. The result carries `providerOrderId`, `paymentResult`, and a `contextToken` when the Store API session changed. `providerOrderId` is the PayPal order id. The Shopware order id comes from `createOrder()`.

Copy a returned context token onto your Store API client before placing the order. In the Nuxt module, assigning `apiClient.defaultHeaders["sw-context-token"]` stores the cookie as well. Then place the Shopware order, call `handlePayment`, and follow a returned `redirectUrl` (3-D Secure and similar payer actions). Your page confirms the transaction state on the finish page before showing a paid order.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/shared-approval.ts" code lang="ts" no-name -->

```ts
import {
  useCart,
  useCheckout,
  useSessionContext,
  useShopwareContext,
} from "#imports";

import { shopwarePayments } from "./init";
import type { ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { createOrder } = useCheckout();
const { refreshCart } = useCart();

function shopwareOrderId(order: object): string {
  if ("id" in order && typeof order.id === "string" && order.id !== "") {
    return order.id;
  }

  throw new Error("The Store API order response did not include an id");
}

async function onApprove(result: ApprovalResult) {
  if (result.contextToken) {
    apiClient.defaultHeaders["sw-context-token"] = result.contextToken;
    await refreshSessionContext();
  }

  const order = await createOrder();
  await refreshCart();

  const response = await shopwarePayments.handlePayment({
    orderId: shopwareOrderId(order),
    providerOrderId: result.providerOrderId,
    contextToken: result.contextToken,
    finishUrl: `${window.location.origin}/checkout/success?order=${shopwareOrderId(order)}&success=true`,
    errorUrl: `${window.location.origin}/checkout/success?order=${shopwareOrderId(order)}&success=false`,
  });

  if (response.redirectUrl) {
    window.location.assign(response.redirectUrl);
  }
}

export { onApprove };
```

<!-- /automd -->

`handlePayment()` posts the Shopware order id and sends the provider id as `sp-id`. Catch its failures in the calling code. Order creation and `handlePayment()` are not retried automatically. A lost response can mean the server finished the call, so check the order before offering another attempt.

## PayPal

Render a merchant-owned `<paypal-button>`. Button color and shape come from the ShopwarePayments storefront configuration. The same saved shape is applied to Apple Pay and Google Pay. The page does not pass those styles.

`onClick` runs before the wallet session starts. Return `false` synchronously to leave the session closed.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/paypal-button.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-button");

await shopwarePayments.buttons({
  funding: "paypal",
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});
```

<!-- /automd -->

## Pay Later

Use the same `buttons()` call with `funding: "paylater"` and a `<paypal-pay-later-button>` host. Approval and `handlePayment()` stay the same.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/pay-later-button.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-pay-later-button");

await shopwarePayments.buttons({
  funding: "paylater",
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});
```

<!-- /automd -->

### Pay Later messages

`messages()` renders a `<paypal-message>` for a decimal string amount. Locations are `product-details`, `cart`, `mini-cart`, `login`, and `footer`. The call resolves to `null` when that location is disabled, and `update({ amount })` refreshes the message. This call only renders the promotional amount.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/pay-later-message.ts" code lang="ts" no-name -->

```ts
import { shopwarePayments } from "./init";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-message");

const messages = await shopwarePayments.messages({
  element,
  location: "product-details",
  amount: "29.99",
});

messages?.update({ amount: "49.99" });
```

<!-- /automd -->

## Apple Pay

Add an `<apple-pay-button>` on the page. `applePay()` loads the Apple Pay script, or reuses a script tag or `ApplePaySession` the page already has. Register the storefront host under **Settings → Apple Pay**, download the association file from that screen, and serve it at `/.well-known/apple-developer-merchantid-domain-association` on that host. A headless app on its own domain needs its own registration. The Shopware storefront domain does not cover it.

Setup rejects with `NOT_ELIGIBLE` when the browser has no `ApplePaySession` version 4. `buttons()` funding stays `paypal` or `paylater`; Apple Pay goes through `applePay()`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/apple-pay.html" code lang="html" no-name -->

```html
<apple-pay-button></apple-pay-button>
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/apple-pay.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("apple-pay-button");

await shopwarePayments.applePay({
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});
```

<!-- /automd -->

## Google Pay

Add a `<google-pay-button>`. Any other element fails setup before the Google Pay script loads. The element can sit in the page before `init()`. `googlePay()` loads the Google Pay script, or reuses a script tag or `google.payments.api.PaymentsClient` the page already has, and then upgrades the element. Setup rejects with `NOT_ELIGIBLE` when the button is not ready to pay. Google Pay goes through `googlePay()`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/google-pay.html" code lang="html" no-name -->

```html
<google-pay-button></google-pay-button>
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/google-pay.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("google-pay-button");

await shopwarePayments.googlePay({
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});
```

<!-- /automd -->

## Card fields

Provide three empty containers. `cardFields()` inserts the number, expiry, and CVV fields and returns `{ submit() }`. Call `submit()` from your own pay button. `onBeforeSubmit` runs first. Returning `false`, throwing, or leaving the fields incomplete stops submission without `onError`. `onValidationChange` reports `isValid`, `isEmpty`, and `isPotentiallyValid` for each field, plus `isComplete`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/card-fields.html" code lang="html" no-name -->

```html
<div id="card-number"></div>
<div id="card-expiry"></div>
<div id="card-cvv"></div>
<button type="button" id="card-pay">Pay</button>
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/card-fields.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";

function field(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Add #${id} before rendering card fields`);
  }

  return element;
}

const cardFields = await shopwarePayments.cardFields({
  elements: {
    number: field("card-number"),
    expiry: field("card-expiry"),
    cvv: field("card-cvv"),
  },
  checkout: cartCheckout,
  onApprove,
  onError,
  onBeforeSubmit() {
    return true;
  },
});

document.getElementById("card-pay")?.addEventListener("click", () => {
  void cardFields.submit();
});
```

<!-- /automd -->

Each host element can be hydrated once. After a failed setup the element can be tried again. After a successful setup, replacing the UI means using new elements.

## Redirect payment methods

Bancontact, EPS, BLIK, iDEAL, Przelewy24, and Klarna do not require the JS library.

## Errors

Catch rejections from `init()` and from `buttons()`, `applePay()`, `googlePay()`, `cardFields()`, and `messages()`. Failures inside a payment session are passed to `onError` as a `ShopwarePaymentsError` with `code`, `step`, and an optional `correlationId`.

`NOT_ELIGIBLE` means the browser, the merchant account, or PayPal cannot offer that method. `UNSUPPORTED_CAPABILITY` means the checkout asked for vaulting, Express Checkout, or a subscription. `init`, `script_load`, and `setup` mean the element was not hydrated: keep that method hidden. `submit` and `approve` leave the element mounted. A resolved `submit()` promise is not itself a paid order.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/on-error.ts" code lang="ts" no-name -->

```ts
import type { ShopwarePaymentsError } from "./snippet-context";

function onError(error: ShopwarePaymentsError) {
  const setupFailed =
    error.code === "NOT_ELIGIBLE" ||
    error.code === "UNSUPPORTED_CAPABILITY" ||
    error.step === "init" ||
    error.step === "script_load" ||
    error.step === "setup";

  if (setupFailed) {
    console.error(
      "ShopwarePayments setup failed",
      error.code,
      error.correlationId,
    );
    return;
  }

  console.error(
    "ShopwarePayments could not finish the payment session",
    error.code,
    error.step,
    error.correlationId,
  );
}

export { onError };
```

<!-- /automd -->
