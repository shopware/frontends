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

This guide shows how to integrate ShopwarePayments in a headless storefront with the `shopware-payments.js` library. The library renders PayPal, Pay Later, Apple Pay, Google Pay, and card fields, and it creates the provider order (the PayPal order). The storefront keeps the cart, the customer, shipping, and the Shopware order.

Read [How the ShopwarePayments client works](#how-the-shopwarepayments-client-works) before the [examples](#examples). The examples call the same methods with Shopware Frontends composables such as `useCart()` and `useCheckout()`.

The [PayPal integration](./paypal.html) covers the separate SwagPayPal extension. ShopwarePayments uses the browser library on this page.

## Prerequisites

Install ShopwarePayments and enable the payment methods for the sales channel. The page needs the shopper's current Store API session: the sales channel id, the Store API access key, the context token, and the active currency.

## Load the library

Load the library with a `<script>` tag from the production host `headless.shopware-payments.services.shopware.io`.

Pin the major with `/headless/v1/`. That alias is updated with each compatible release, so the page receives fixes without a breaking change. This guide is written for **1.0.0**. That release ships PayPal, Pay Later, Apple Pay, Google Pay, card fields, and `handlePayment`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/load-the-library.html" code lang="html" no-name -->

```html
<script
  src="https://headless.shopware-payments.services.shopware.io/headless/v1/shopware-payments.js"
  crossorigin="anonymous"
></script>
```

<!-- /automd -->

## Initialize

:::tip Client only
The ShopwarePayments library and all its methods should only be invoked on client side rendered pages. The init snippet reads `window` at module level, so import it from client-only code. In `vue-starter-template`, the product page and the footer are server-rendered, and those pages host the `product-details` and `footer` message locations.
:::

Call `window.ShopwarePayments.init()` after the script loads. Pass the shopper's current Store API session. The client keeps the context token, currency, and sales channel from that call. Call `init()` again, and render into new elements, when the token, currency, or sales channel changes.

| Option                  | Value                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `storefrontUrl`         | Absolute Shopware base URL, including a language prefix or subdirectory. A trailing `/store-api` is removed, so a Store API endpoint works too. |
| `salesChannelId`        | 32-character hexadecimal id of the same sales channel as the access key                                                                        |
| `storeApi.accessKey`    | Sales channel Store API access key                                                                                                             |
| `storeApi.contextToken` | Shopper's current `sw-context-token`                                                                                                           |
| `currencyCode`          | Active currency ISO code, such as `EUR`                                                                                                        |

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/init-inputs.ts" code lang="ts" no-name -->

```ts
import type { ShopwarePaymentsClient } from "./snippet-context";

// These values are the shopper's current Store API session.
// Call init() again when the token, currency, or sales channel changes,
// and render into new elements.
const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL, including a language prefix or subdirectory.
    // A trailing /store-api is removed.
    storefrontUrl: "https://shop.example/en",
    salesChannelId: "SALES_CHANNEL_ID",
    storeApi: {
      accessKey: "SWSC_ACCESS_KEY",
      contextToken: "CONTEXT_TOKEN",
    },
    currencyCode: "EUR",
  });

export { shopwarePayments };
```

<!-- /automd -->

A resolved `init()` promise means the client can render payment UI. It has not placed a Shopware order. Login and guest registration replace the context token. A client created before that change, such as one that rendered a footer message, keeps the earlier token and creates the PayPal order on that context, which is empty afterwards. Catch the rejection and keep the payment UI hidden. Invalid options reject with `step: "init"`. The codes and the steps that leave the UI mounted are listed under [Errors](#errors).

## Provider scripts

`buttons()`, `applePay()`, `googlePay()`, `cardFields()`, and `messages()` load the PayPal Web SDK for the components that call needs. `applePay()` also loads the Apple Pay script, and `googlePay()` loads the Google Pay script.

An Apple Pay or Google Pay `<script>` tag that is already on the page is reused. Safari still needs the Apple Pay script, because that script defines `<apple-pay-button>`. The library inserts the PayPal script itself when a surface is set up. A [preload](#preload-the-paypal-sdk) can start that download earlier.

## How the ShopwarePayments client works

`init()` returns a client. Calling a render method paints the payment control and, on approval, creates a provider order. The Shopware order stays in the page's hands.

### Payment buttons and storefront logic

The wallet button and the Shopware checkout are separate.

The library renders the control into an element the page already owns, and it binds the handlers you pass in the same call. Button color and shape come from the ShopwarePayments storefront configuration. The same saved shape is applied to Apple Pay and Google Pay. The page does not pass those styles.

The page owns the Shopware work. `buttons()`, `applePay()`, `googlePay()`, and `cardFields()` leave the session's payment method unchanged. The context holds one method, so `onApprove` calls `setPaymentMethod()` with that surface's Store API payment method id immediately before `createOrder()`. When the Shopware order already exists, its transaction has to use the same method.

`onClick` is that gate for a wallet button. Return `false` synchronously, or throw, and the wallet session stays closed. The library starts the session without waiting for an `onClick` promise. A promise that resolves `false` skips order creation. A rejected `onClick` promise is passed to `onError`.

Card fields have no wallet click. The page's own pay button calls `submit()`. `onBeforeSubmit` runs first.

### Methods

| Method            | What to pass                                                                                         | What it returns                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `buttons()`       | `funding: "paypal"` or `"paylater"`, a host element, `checkout`, `onApprove`, `onError`              | A promise that resolves when the button is ready     |
| `applePay()`      | An `<apple-pay-button>`, `checkout`, `onApprove`, `onError`                                          | A promise that resolves when the button is ready     |
| `googlePay()`     | A `<google-pay-button>`, `checkout`, `onApprove`, `onError`                                          | A promise that resolves when the button is ready     |
| `cardFields()`    | Hosts for number, expiry, and CVV, plus `checkout`, `onApprove`, `onError`                           | `{ submit() }`                                       |
| `messages()`      | A `<paypal-message>`, a location, and a decimal string `amount`                                      | `{ update({ amount }) }`, or `null` when disabled    |
| `handlePayment()` | Shopware `orderId`, `providerOrderId`, and optional `contextToken`, `finishUrl`, `errorUrl`          | `{ redirectUrl }`                                    |

`funding` on `buttons()` stays `paypal` or `paylater`. Apple Pay and Google Pay have their own methods. Each host element can be hydrated once. After a failed setup the element can be tried again. After a successful setup, replacing the UI means using new elements.

Bancontact, EPS, BLIK, iDEAL, Przelewy24, and Klarna are Shopware redirect payments. They do not use this client. Select the method, place the Shopware order, and POST `/store-api/handle-payment` directly, then follow `redirectUrl`.

### Callbacks

| Callback              | When it runs                                                                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onClick`             | Wallet buttons, before the provider session starts. A synchronous `false` or a throw leaves the session closed.                                                                   |
| `onBeforeSubmit`      | Card fields, from `submit()`, before the provider order is created. Returning `false`, throwing, or leaving the fields incomplete stops submission and does not call `onError`. |
| `onValidationChange`  | Card fields, when number, expiry, or CVV validity changes. Each field reports `isValid`, `isEmpty`, and `isPotentiallyValid`. `isComplete` covers all three.                      |
| `onApprove`           | After the shopper approves the provider order. The result carries `providerOrderId` (the PayPal order id), `paymentResult`, and `contextToken` when the Store API session changed. The Shopware order is still unplaced for a cart checkout. |
| `onCancel`            | The shopper closes the session without approving.                                                                                                                                 |
| `onError`             | A failure inside a session that already started. Failures while `init()` or a render method is still setting up reject that promise instead. See [Errors](#errors).              |

`messages()` has no payment callbacks. The call only renders the promotional amount, and `update({ amount })` refreshes it. Locations are `product-details`, `cart`, `mini-cart`, `login`, and `footer`.

Inside `onApprove`, copy a returned `contextToken` onto the Store API client before placing the order. For a cart, select the payment method for the approved surface, call `createOrder()`, then `handlePayment()`. For an order the page already has, call `handlePayment()` with that order's id. Follow `redirectUrl` when the provider needs another payer action, such as 3-D Secure. With no `redirectUrl`, open the success page and read the transaction state there. A missing redirect is not a paid transaction: a pending capture can come back as `in_progress`.

`handlePayment()` posts the Shopware order id and sends the provider id as `sp-id`. After that call the transaction is not `open`.

### Checkout payload

Every payment surface takes a `checkout` object. Pass the cart and the sales channel context, or pass an existing Shopware order. Pass one of those two shapes. Include the nested prices, line items, deliveries, and customer data the Store API already returned.

The library keeps the object from setup and reads `cart` and `salesChannelContext` again on each click, so those two fields can be getters. The wallet total comes from `cart.price.totalPrice`. An optional `returnUrl` is an absolute `http` or `https` URL.

The library uses this payload to create the provider order. For a cart, the page still places the Shopware order after approval. For an order that already exists, pass its id to `handlePayment()` and leave the cart unchanged.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/checkout-inputs.ts" code lang="ts" no-name -->

```ts
import type { CartCheckout, PlacedOrderCheckout } from "./snippet-context";

// The library keeps this object and reads both getters again on each click.
// `cart` is the Store API cart (prices, line items, deliveries).
// `salesChannelContext` is the Store API context (currency, customer, sales channel).
function cartCheckout(cart: object, salesChannelContext: object): CartCheckout {
  return {
    get cart() {
      return cart;
    },
    get salesChannelContext() {
      return salesChannelContext;
    },
  };
}

// `order` is the Store API order. Pass this shape instead of the cart.
function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
```

<!-- /automd -->

A placed order needs `currency.isoCode`, `billingAddress.country.iso`, `deliveries[].shippingOrderAddress.country.iso`, `lineItems`, `transactions`, and `orderCustomer`. Wallet and card setup reject subscription data with `UNSUPPORTED_CAPABILITY`.

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

## Optimizations

### Preload the PayPal SDK

The PayPal script is requested when the first payment surface is set up. A preload starts that download with the page:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/preload-paypal.html" code lang="html" no-name -->

```html
<link rel="preload" href="https://www.paypal.com/web-sdk/v6/core" as="script" />
```

<!-- /automd -->

Sandbox shops preload `https://www.sandbox.paypal.com/web-sdk/v6/core` instead. The same pattern applies to the scripts `applePay()` and `googlePay()` load: `https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js` and `https://pay.google.com/gp/p/js/pay.js`.

### Shop id

The app shop id can be passed as `shopId` to `init()`, or set on the script as `data-shop-id`. The option wins when both are set.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/shop-id.html" code lang="html" no-name -->

```html
<script
  src="https://headless.shopware-payments.services.shopware.io/headless/v1/shopware-payments.js"
  data-shop-id="YOUR_SHOP_ID"
  crossorigin="anonymous"
></script>
```

<!-- /automd -->

`data-shop-id` is this shop's app shop id. Read it on the Shopware server with `bin/console system:config:get core.app.shopIdV2` and copy the `id` value. Shops that still store the previous key return it from `bin/console system:config:get core.app.shopId`. Copy `value` from that output.

## Examples

The snippets below wire the client to Shopware Frontends. They pass the same inputs as the sections above.

### Initialize from the session

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

// This client keeps the token, currency, and sales channel below.
// Call init() again when one of them changes, and render into new elements.
const shopwarePayments: ShopwarePaymentsClient =
  await window.ShopwarePayments.init({
    // Shopware base URL. A trailing /store-api on the Nuxt endpoint is removed.
    storefrontUrl: endpoint,
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

### Cart checkout

On a fresh `/checkout` load, `vue-starter-template` starts `refreshCart()` in `app.vue`'s `onMounted`, so `cart.value` can still be empty. The snippet loads the cart when it is missing. The getters read the composables again on each click, so a cart or shipping change after render is what the next click sends.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/checkout.ts" code lang="ts" no-name -->

```ts
import { useCart, useSessionContext } from "#imports";

import type { CartCheckout, PlacedOrderCheckout } from "./snippet-context";

const { cart, refreshCart } = useCart();
const { sessionContext } = useSessionContext();

const currentCart = cart.value ?? (await refreshCart());
const context = sessionContext.value;

if (!currentCart || !context) {
  throw new Error("Cart and session are required before rendering payment UI");
}

const cartCheckout: CartCheckout = {
  // The library keeps this object and reads these fields again on each click.
  get cart() {
    return cart.value ?? currentCart;
  },
  get salesChannelContext() {
    return sessionContext.value ?? context;
  },
};

function placedOrderCheckout(order: object): PlacedOrderCheckout {
  return { order };
}

export { cartCheckout, placedOrderCheckout };
```

<!-- /automd -->

### Approve a cart payment

`onApprove` runs after the shopper approves the provider order for a cart that has not been ordered yet. The Shopware order id comes from `createOrder()`.

In the Nuxt module, assigning `apiClient.defaultHeaders["sw-context-token"]` stores the cookie as well. `/checkout/success/<id>/paid` is static and always says the order is paid, so do not use it as `finishUrl`. `vue-starter-template` loads the order on `/checkout/success/<id>` and shows the order state. When `handlePayment()` throws, open `/checkout/success/<id>/unpaid`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/shared-approval.ts" code lang="ts" no-name -->

```ts
import {
  useCart,
  useCheckout,
  useNotifications,
  useSessionContext,
  useShopwareContext,
} from "#imports";

import { shopwarePayments } from "./init";
import type { ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { createOrder, setPaymentMethod } = useCheckout();
const { refreshCart } = useCart();
const { pushError } = useNotifications();

async function onApprove(result: ApprovalResult, paymentMethodId: string) {
  let orderId: string;

  try {
    if (result.contextToken) {
      apiClient.defaultHeaders["sw-context-token"] = result.contextToken;
      await refreshSessionContext();
    }

    // The session holds one method. Select the one for the surface
    // the shopper approved before the order is placed.
    await setPaymentMethod({ id: paymentMethodId });
    const order = await createOrder();
    orderId = order.id;
  } catch (error) {
    console.error("ShopwarePayments could not place the order", error);
    pushError("The order was not placed. Stay on checkout and try again.", {
      persistent: true,
    });
    return;
  }

  try {
    await refreshCart();
  } catch (error) {
    console.error("ShopwarePayments could not refresh the cart", error);
  }

  const finishUrl = `${window.location.origin}/checkout/success/${orderId}`;
  const errorUrl = `${window.location.origin}/checkout/success/${orderId}/unpaid`;

  try {
    const response = await shopwarePayments.handlePayment({
      orderId,
      providerOrderId: result.providerOrderId,
      contextToken: result.contextToken,
      finishUrl,
      errorUrl,
    });
    window.location.assign(response.redirectUrl || finishUrl);
  } catch (error) {
    console.error("ShopwarePayments could not handle the payment", error);
    window.location.assign(errorUrl);
  }
}

export { onApprove };
```

<!-- /automd -->

In `vue-starter-template`, the success page calls Store API `handle-payment` on load. That endpoint only pays a transaction that is still `open`, so the second call does nothing. The first `try` covers the context-token update, `setPaymentMethod()`, and `createOrder()`. When that `try` throws, no Shopware order exists. `pushError()` from `useNotifications()` shows the message on checkout, with `{ persistent: true }` so it stays on screen, and `onApprove` returns without leaving the page. The shopper can correct the cart or the address and approve again. `vue-starter-template` renders those notifications on the checkout page. `refreshCart()` runs only after `createOrder()` resolves. When the cart refresh throws, the error is logged and `handlePayment()` still runs, because the order already exists. The second `try` catches a thrown `handlePayment()` error and opens `/checkout/success/<id>/unpaid`. Neither step is retried automatically. A lost `handlePayment()` response can mean the server finished the call, so check the order before offering another attempt.

### Pay an existing order

`placedOrderCheckout` wraps a Shopware order the page already has, such as a payment started again from the customer account. The default order tree in `useOrderDetails()` loads line items, transactions, and deliveries, but not `currency` or any address country. `loadPlacedOrder` names `currency`, `orderCustomer`, `billingAddress.country`, and `deliveries.shippingOrderAddress.country`. `addresses.country` fills the address list the detail page reads, so it does not satisfy the billing check. That repeated payment is usually a failed or cancelled transaction. Store API `handle-payment` only pays a transaction that is still `open`. Any other state returns no `redirectUrl` and never calls ShopwarePayments, so the shopper lands on `finishUrl` and the approval is not captured. `onApprovePlacedOrder` calls `orderSetPayment post /order/payment` with the ShopwarePayments method id before `handlePayment()`. Core reopens the last transaction when the method and amount still match, and otherwise adds a new open transaction. The method has to allow payment after the order. The same handler fits the other payment surfaces.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/placed-order-approval.ts" code lang="ts" no-name -->

```ts
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

import { placedOrderCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { requireElement, type ApprovalResult } from "./snippet-context";

const { apiClient } = useShopwareContext();

// Store API id of the ShopwarePayments method for this surface.
const paymentMethodId = "SHOPWARE_PAYMENTS_METHOD_ID";

async function onApprovePlacedOrder(orderId: string, result: ApprovalResult) {
  const finishUrl = `${window.location.origin}/checkout/success/${orderId}`;
  const errorUrl = `${window.location.origin}/checkout/success/${orderId}/unpaid`;

  try {
    // A failed or cancelled transaction is not open. handle-payment only pays
    // an open one, so reopen this transaction or replace it before capture.
    await apiClient.invoke("orderSetPayment post /order/payment", {
      body: {
        orderId,
        paymentMethodId,
      },
    });

    const response = await shopwarePayments.handlePayment({
      orderId,
      providerOrderId: result.providerOrderId,
      contextToken: result.contextToken,
      finishUrl,
      errorUrl,
    });
    window.location.assign(response.redirectUrl || finishUrl);
  } catch (error) {
    console.error("ShopwarePayments could not handle the payment", error);
    window.location.assign(errorUrl);
  }
}

async function payExistingOrder(order: Schemas["Order"]) {
  const element = requireElement("paypal-button");

  await shopwarePayments.buttons({
    funding: "paypal",
    element,
    checkout: placedOrderCheckout(order),
    onApprove: (result) => onApprovePlacedOrder(order.id, result),
    onError,
  });
}

// Reads the order with the associations the create-order validation needs.
// The default detail tree has no currency and no address countries, so they
// are named here. billingAddress.country must be named on its own:
// addresses.country only fills the address list, not order.billingAddress.
async function loadPlacedOrder(orderId: string): Promise<Schemas["Order"]> {
  const response = await apiClient.invoke("readOrder post /order", {
    body: {
      ids: [orderId],
      associations: {
        currency: {},
        orderCustomer: {},
        lineItems: {},
        transactions: {},
        billingAddress: {
          associations: {
            country: {},
          },
        },
        deliveries: {
          associations: {
            shippingOrderAddress: {
              associations: {
                country: {},
              },
            },
          },
        },
      },
    },
  });

  const order = response.data.orders?.elements?.[0];

  if (!order) {
    throw new Error(`Order ${orderId} was not found`);
  }

  return order;
}

export { loadPlacedOrder, onApprovePlacedOrder, payExistingOrder };
```

<!-- /automd -->

### PayPal

Render a merchant-owned `<paypal-button>`.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/paypal-button.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-button");
const PAYPAL_METHOD_ID = "PAYPAL_METHOD_ID";

await shopwarePayments.buttons({
  funding: "paypal",
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, PAYPAL_METHOD_ID),
  onError,
});
```

<!-- /automd -->

### Pay Later

Use the same `buttons()` call with `funding: "paylater"` and a `<paypal-pay-later-button>` host. Approval and `handlePayment()` stay the same.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/shopware-payments/pay-later-button.ts" code lang="ts" no-name -->

```ts
import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-pay-later-button");
const PAY_LATER_METHOD_ID = "PAY_LATER_METHOD_ID";

await shopwarePayments.buttons({
  funding: "paylater",
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, PAY_LATER_METHOD_ID),
  onError,
});
```

<!-- /automd -->

#### Pay Later messages

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

### Apple Pay

Add an `<apple-pay-button>` on the page. Setup rejects with `NOT_ELIGIBLE` when the browser has no `ApplePaySession` version 4. Register the storefront host under **Settings → Apple Pay**, download the association file from that screen, and serve it at `/.well-known/apple-developer-merchantid-domain-association` on that host. A headless app on its own domain needs its own registration. The Shopware storefront domain does not cover it.

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
const APPLE_PAY_METHOD_ID = "APPLE_PAY_METHOD_ID";

await shopwarePayments.applePay({
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, APPLE_PAY_METHOD_ID),
  onError,
});
```

<!-- /automd -->

### Google Pay

Add a `<google-pay-button>`. Any other element fails setup before the Google Pay script loads. The element can sit in the page before `init()`. Setup rejects with `NOT_ELIGIBLE` when the button is not ready to pay.

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
const GOOGLE_PAY_METHOD_ID = "GOOGLE_PAY_METHOD_ID";

await shopwarePayments.googlePay({
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, GOOGLE_PAY_METHOD_ID),
  onError,
});
```

<!-- /automd -->

### Card fields

Provide three empty containers. Call `submit()` from your own pay button.

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

const CARD_METHOD_ID = "CARD_METHOD_ID";

const cardFields = await shopwarePayments.cardFields({
  elements: {
    number: field("card-number"),
    expiry: field("card-expiry"),
    cvv: field("card-cvv"),
  },
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, CARD_METHOD_ID),
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

## Not supported yet

::: warning
**Pay upon Invoice (PUI)**, the **express button**, and **vaulting** are **not supported yet**. Support for them is coming soon.
:::
