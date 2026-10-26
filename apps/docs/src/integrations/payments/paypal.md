---
head:
  - - meta
    - name: og:title
      content: "PayPal Integration"
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to implement a custom payment flow based on PayPal Checkout."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Paypal%20Checkout.png"
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# PayPal Integration

<img src="../../.assets/payment-icons/paypal.png" alt="Paypal Logo" class="mb-8 h-20" />

:::tip Advanced Guide - prior knowledge required
In order to follow this guide properly, we recommend that you get familiar with the payment flow and payment API concepts first.

- [Payment Flow in Shopware 6](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments)
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)
  :::

In this chapter you will learn how to integrate a payment flow with Shopware Frontends. There are various ways in which payment providers integrate with Shopware's API, so it is likely that you need to consult the documentation of your payment provider to get the details.

This specific guides shows how to integrate the **PayPal Checkout** including **PayPal Express Checkout**. However, the general flow is the same for all payment providers, so you will be able to use this guide as a reference for different providers.

Specifically, you will learn how to

- Prepare the Shopware instance for taking PayPal payments
- Embed payment buttons in your frontend
- React on PayPal events to prepare and capture the payment

## Install the payment extension

Payment integrations require communication with the backend for various scenarios

- Create a PayPal order
- Inform PayPal which payment was selected
- Capture the user payment after approval from the provider
- Update the order status
- Notify customers on successful/failed payment
- Other actions that need additional credentials which should stay hidden (i.e. secret authorization tokens)

That's why the backend as a Payment middleware is a good option to store additional information, credentials, react on events and so on.

:::tip
Make sure that the Payment Provider you would like to install, provides also an interface to interact via Store-API for headless solutions, specially when it's a synchronous payment flow.
:::

The [SwagPayPal](https://github.com/shopware/SwagPayPal) extension is available on Shopware Cloud stores and also can be installed manually in self-managed instances. It provides useful endpoints to conduct payments with PayPal. We will be using two PayPal-specific endpoints in this guide:

### Create order

`/store-api/paypal/create-order`
`/store-api/paypal/express/create-order` (Express)

- Creates an order directly with PayPal which contains information about the cart and the user
- Updates an existing order if given an order ID
- Returns a payment intent token that identifies the order in PayPal

### Prepare checkout (Express)

`/store-api/paypal/express/prepare-checkout`

- Used after PayPal approved the payment process request
- Registers a customer based on PayPal account's data (name, address, email) and logs them in
- The API Client receives a new context token that points to the logged-in customer

## Embed Payment buttons

The next step is to embed the PayPal Checkout buttons in your frontend using the PayPal Javascript SDK. The SDK can be loaded from the PayPal CDN or using an npm package ([PayPal SDK Documentation](https://developer.paypal.com/sdk/js/configuration/)). In our example we're going to use the second option.

### Load the PayPal SDK

:::tip Client only
The PayPal SDK and all its methods should only be invoked on client side rendered pages.
:::

In a Vue component we can use the `loadScript` method from the [`@paypal/paypal-js`](https://www.npmjs.com/package/@paypal/paypal-js) npm package:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/load-the-paypal-sdk.ts" code lang="ts" no-name -->

```ts
import { loadScript } from "@paypal/paypal-js";

loadScript({
  // client id is generated in the PayPal account's apps section
  clientId:
    "AUAcLFoadrmy9JiW2cHgriy1mTy0MCqQOP_1SSeQEUArz_zPeF1VcNY2CCxcFBQpf_N4g1k5wFVNJ1Bk",
  currency: "EUR", // or use some reference to the current currency
  locale: "en_US", // as same as in the field above
});
```

<!-- /automd -->

Now, the `paypal` object will be available in the global `window` object.

Alternatively, the `loadScript` function returns a promise resolving to the paypal object. This can be useful if you want to load the script multiple times with different options. Note that you must delete `window.paypal` first.

### Register the buttons

In order to display a PayPal Button component, we need to mount it in the DOM.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/register-the-buttons.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { getPayPal } from "./snippet-context";

const divContainer = ref<HTMLElement>();
const buttonOptions = {}; // Add your PayPal button configuration here.

// client only
getPayPal().Buttons(buttonOptions).render(divContainer.value!);
// this script will mount the component in element `divContainer`
```

<!-- /automd -->

## React on PayPal events

Now, that the buttons are properly displayed, we need to react to two basic events.

- `createOrder`
- `onApprove`

There are additional events like `onInit`, `onClick`, `onCancel` or `onError` (and more) to be used on specific cases, which we are not going to cover in this guide.

### `createOrder` event

In the `creatOrder` callback, you need to prepare the PayPal order and return a token that identifies the order in PayPal. This token will be used later on to capture the payment.
It is called when the user clicks on the PayPal checkout button.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/createorder-event.ts" code lang="ts" no-name -->

```ts
import type { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import { ref } from "vue";

import { apiClient, getPayPal } from "./snippet-context";

const divContainer = ref<HTMLElement>();

// client only
getPayPal()
  .Buttons({
    createOrder: async (
      _data: CreateOrderData,
      _actions: CreateOrderActions,
    ) => {
      const response = await apiClient.invoke(
        "createPayPalOrder post /store-api/paypal/create-order",
      );
      return response.data.token;
    },
  })
  .render(divContainer.value!);
```

<!-- /automd -->

### `createOrder` event (Express)

In the `creatOrder` callback, you need to prepare the PayPal order and return a token that identifies the order in PayPal. This token will be used later on to capture the payment.
It is called when the user clicks on the PayPal express checkout button.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/createorder-event-express.ts" code lang="ts" no-name -->

```ts
import type { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";
import { ref } from "vue";

import {
  addToCart,
  apiClient,
  getPayPal,
  paypalMethod,
  setPaymentMethod,
} from "./snippet-context";

const divContainer = ref<HTMLElement>();

// client only
getPayPal()
  .Buttons({
    createOrder: async (
      _data: CreateOrderData,
      _actions: CreateOrderActions,
    ) => {
      await setPaymentMethod(paypalMethod.value);

      await addToCart();

      const response = await apiClient.invoke(
        "createPayPalExpressOrder post /store-api/paypal/express/create-order",
      );
      return response.data.token;
    },
  })
  .render(divContainer.value!);
```

<!-- /automd -->

The approach here is to set the payment method internally, then add a current product to the cart, and then prepare a PayPal token to be used later on.

In the example above we do a couple of things:

1.  Set the payment method for the current context
2.  Add a product to the cart
3.  Create a PayPal order and return the token

### `onApprove` event

This event is called when the user approves the payment process. It's the last step before the payment is captured.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/onapprove-event.ts" code lang="ts" no-name -->

```ts
import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { ref } from "vue";

import { apiClient } from "./snippet-context";

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

const orderCreated = ref<{ id: string }>();

export const paypalButtonsConfig = {
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, _actions: OnApproveActions) => {
    // createOrder from useCheckout composable
    orderCreated.value = await createOrder({
      paypalOrderId: data.orderID,
    });
    refreshCart();
    const order = orderCreated.value;

    // apiClient from useShopwareContext composable
    const handlePaymentResponse = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        query: {
          paypalOrderId: data.orderID,
        },
        body: {
          orderId: order.id,
          finishUrl: `${window.location.origin}/order/finish?order=${order.id}&success=true`,
        },
      },
    );
    // call the /payment/finalize-transaction endpoint
    await fetch(handlePaymentResponse.data.redirectUrl);
    // ...
  },
};
```

<!-- /automd -->

The example above shows the code that is executed after a payer approves the PayPal popup. This function calls `createOrder()` which creates an order through the Store-API. Once the order is created, its `id` can be used to invoke the `handle-payment` action to process payment. This action captures the money or redirects the user to an external payment gateway.

### `onApprove` event (Express)

This event is called when the user approves the payment process. It's the last step before the payment is captured.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/onapprove-event-express.ts" code lang="ts" no-name -->

```ts
import type { OnApproveActions, OnApproveData } from "@paypal/paypal-js";

import { apiClient } from "./snippet-context";

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

export const paypalButtonsConfig = {
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, _actions: OnApproveActions) => {
    await apiClient.invoke(
      "preparePayPalExpressCheckout post /store-api/paypal/express/prepare-checkout",
      {
        body: { token: data.orderID },
      },
    );
    // createOrder from useCheckout composable
    const order = await createOrder({ paypalOrderId: data.orderID });
    refreshCart();

    // redirect to order confirmation site

    // - OR - one-click checkout
    const handlePaymentResponse = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        query: {
          isPayPalExpressCheckout: true,
          paypalOrderId: data.orderID,
        },
        body: {
          orderId: order.id,
          finishUrl: `${window.location.origin}/order/finish?order=${order.id}&success=true`,
        },
      },
    );
    // call the /payment/finalize-transaction endpoint
    await fetch(handlePaymentResponse.data.redirectUrl);
    // ...
  },
};
```

<!-- /automd -->

The example above shows the code that is executed after a payer approves the PayPal popup. This function calls the `prepare-checkout` endpoint to register the upcoming PayPal transaction.

Thanks to the internal logic of the PayPal extension, the is already connected with the logged in customer. Now you can call `createOrder()` which creates an order through the Store-API. Once the order is created, its `id` can be used to invoke the `handle-payment` action to process payment. This action captures the money or redirects the user to an external payment gateway.

## Working example (Express)

The example shows the specific case, when a product can be bought in one action from the frontend.

<StackBlitzLiveExample projectPath="shopware/frontends/tree/main/examples/express-checkout" openPath="/" />

## Integrating other PayPal payment methods

PayPal additionally provides Pay Later and Credit card (ACDC) alongside with a variety of alternative payment methods like Apple Pay, Google Pay or Venmo.
For reference check out [PayPal's documentation](https://developer.paypal.com/docs/checkout/) on integrating these.

### Shared behaviour of `createOrder` and `onApprove`

The `createOrder` and `onApprove` events are the same for all payment methods.
The only difference is the product used to create the order.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/shared-behaviour-of-createorder-and-onapprove.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { apiClient } from "./snippet-context";

type PayPalProduct = "paylater" | "acdc" | "applepay" | "googlepay" | "venmo";

async function createPayPalOrder(product?: PayPalProduct) {
  const response = await apiClient.invoke(
    "createPayPalOrder post /store-api/paypal/create-order",
    { body: { product } },
  );

  return response?.data?.token;
}

async function onApprove(data: { orderID: string }) {
  // createOrder from useCheckout composable
  orderCreated.value = await createOrder({
    paypalOrderId: data.orderID,
  });
  refreshCart();
  const order = orderCreated.value;

  // apiClient from useShopwareContext composable
  const handlePaymentResponse = await apiClient.invoke(
    "handlePaymentMethod post /handle-payment",
    {
      query: {
        paypalOrderId: data.orderID,
      },
      body: {
        orderId: order.id,
        finishUrl: `${window.location.origin}/order/finish?order=${order.id}&success=true`,
      },
    },
  );
  // call the /payment/finalize-transaction endpoint
  await fetch(handlePaymentResponse.data.redirectUrl);
}

async function createOrder(_payload: { paypalOrderId: string }) {
  return { id: "order-id" };
}

function refreshCart() {}

const orderCreated = ref<{ id: string }>();

export { createPayPalOrder, onApprove };
```

<!-- /automd -->

### Load the PayPal SDK including the additional payment methods

Depending on the type of the payment method and how it integrates with PayPal, you need to add it to `enable-funding` or `components`:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/load-the-paypal-sdk-including-the-additional-payment-methods.ts" code lang="ts" no-name -->

```ts
import { loadScript } from "@paypal/paypal-js";

loadScript({
  // client id is generated in the PayPal account's apps section
  clientId:
    "AUAcLFoadrmy9JiW2cHgriy1mTy0MCqQOP_1SSeQEUArz_zPeF1VcNY2CCxcFBQpf_N4g1k5wFVNJ1Bk",
  // Pay Later or venmo
  enableFunding: "paylater,venmo",
  // ACDC, Apple Pay or Google Pay
  components: "card-fields,applepay,googlepay",
});
```

<!-- /automd -->

### Pay Later

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/pay-later.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const divContainer = ref<HTMLElement>();

getPayPal()
  .Buttons({
    fundingSource: "paylater",
    createOrder: () => createOrder("paylater"),
    onApprove,

    // ...
  })
  .render(divContainer.value!);
```

<!-- /automd -->

### Venmo

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/venmo.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const divContainer = ref<HTMLElement>();

getPayPal()
  .Buttons({
    fundingSource: "venmo",
    createOrder: () => createOrder("venmo"),
    onApprove,

    // ...
  })
  .render(divContainer.value!);
```

<!-- /automd -->

### Credit card (ACDC)

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/credit-card-acdc.ts" code lang="ts" no-name -->

```ts
import { createOrder, getPayPal, onApprove } from "./snippet-context";

const cardStyle = {}; // Add custom card field styling here.

const cardFields = getPayPal().CardFields({
  createOrder: () => createOrder("acdc"),
  onApprove: (data) => onApprove({ orderID: data.orderID }),
  onError: (error) => {
    console.error(error);
  },
  style: cardStyle,
});

const nameField = cardFields.NameField({
  placeholder: "Card holder name",
});
nameField.render("#acdc-name-field-container");

const numberField = cardFields.NumberField({
  placeholder: "Card number",
});
numberField.render("#acdc-number-field-container");

const cvvField = cardFields.CVVField({
  placeholder: "Security code (CVV)",
});
cvvField.render("#acdc-cvv-field-container");

const expiryField = cardFields.ExpiryField({
  placeholder: "Expiration date (MM/YY)",
});
expiryField.render("#acdc-expiry-field-container");
```

<!-- /automd -->

Upon form submit via your own rendered button you need to check the validity of the card fields:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/credit-card-acdc-2.ts" code lang="ts" no-name -->

```ts
import { cardFieldElements, cardFields } from "./snippet-context";

async function onFormSubmit() {
  const cardState = await cardFields.getState();

  if (cardState.isFormValid) {
    // This will trigger the `onApprove` event
    cardFields.submit();

    return;
  }

  // Do some advanced error handling, e.g. focus the invalid field
  const firstInvalidFieldKey = (
    Object.keys(cardState.fields) as Array<keyof typeof cardState.fields>
  ).find((key) => !cardState.fields[key].isValid);
  if (firstInvalidFieldKey) {
    cardFieldElements[firstInvalidFieldKey]?.focus();
  }
}
```

<!-- /automd -->

After submitting the card fields, the `onApprove` event will be triggered.

### Google Pay

For Google Pay to work, you need to load the Google Pay script in the head of your HTML document.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/google-pay.html" code lang="html" no-name -->

```html
<head>
  <script src="https://pay.google.com/gp/p/js/pay.js"></script>
  <!-- ... -->
</head>
```

<!-- /automd -->

Now you can render the Google Pay button in your frontend:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/google-pay-2.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const { cart, totalPrice } = useCart();
const { currency } = useSessionContext();
const divContainer = ref<HTMLElement>();

async function renderGooglePay() {
  if (!window?.google?.payments?.api?.PaymentsClient) {
    throw new Error("Google Pay script is not load");
  }

  const paypal = getPayPal();
  const {
    isEligible,
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    countryCode,
  } = await paypal.Googlepay().config();

  if (!isEligible) {
    throw new Error("Funding for Google Pay is not eligible");
  }

  const gpClient = new window.google.payments.api.PaymentsClient({
    environment: "PRODUCTION", // or "TEST"
    paymentDataCallbacks: {
      onPaymentAuthorized: async (paymentData) => {
        try {
          await onPaymentAuthorized(paymentData);
          return { transactionState: "SUCCESS" };
        } catch (error) {
          return {
            transactionState: "ERROR",
            error: {
              intent: "PAYMENT_AUTHORIZATION",
              reason: "PAYMENT_DATA_INVALID",
              message:
                error instanceof Error ? error.message : "TRANSACTION FAILED",
            },
          };
        }
      },
    },
  });

  const { result } = await gpClient.isReadyToPay({
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
  });
  if (!result) {
    throw new Error("Browser does not support Google Pay");
  }

  const paymentDataRequest: google.payments.api.PaymentDataRequest = {
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
    transactionInfo: {
      countryCode,
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Grand Total",
      currencyCode: currency.value?.isoCode ?? "EUR",
      totalPrice: String(totalPrice.value),
      displayItems: [
        {
          label: "Subtotal",
          price: String(cart.value?.price?.netPrice ?? 0),
          type: "SUBTOTAL",
        },
        {
          label: "Tax",
          price: String(cart.value?.price?.calculatedTaxes?.[0]?.tax ?? 0),
          type: "TAX",
        },
      ],
    },
  };

  gpClient.prefetchPaymentData(paymentDataRequest);

  const button = gpClient.createButton({
    allowedPaymentMethods,
    onClick: () => {
      // do some form validity checks before continue

      gpClient.loadPaymentData(paymentDataRequest).catch(() => undefined);
    },
  });

  divContainer.value?.appendChild(button);
}

async function onPaymentAuthorized(
  paymentData: google.payments.api.PaymentData,
) {
  const orderId = await createOrder("googlepay");

  if (!orderId) {
    throw new Error("PayPal order could not be created");
  }

  const confirmOrderResponse = await getPayPal().Googlepay().confirmOrder({
    orderId,
    paymentMethodData: paymentData.paymentMethodData,
  });

  if (
    !["APPROVED", "PAYER_ACTION_REQUIRED"].includes(confirmOrderResponse.status)
  ) {
    throw new Error("PayPal didn't approve the transaction.");
  }

  if ("PAYER_ACTION_REQUIRED" === confirmOrderResponse.status) {
    await getPayPal().Googlepay().initiatePayerAction({ orderId });
  }

  await onApprove({ orderID: orderId });
}

export { renderGooglePay };
```

<!-- /automd -->

### Apple Pay

For Apple Pay to work, you need to load the Apple Pay script in the head of your HTML document.

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/apple-pay.html" code lang="html" no-name -->

```html
<head>
  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <!-- ... -->
</head>
```

<!-- /automd -->

Now you can render the Apple Pay button in your frontend:

<!-- automd:file src="examples/docs-code-examples/src/generated/integrations/payments/paypal/apple-pay-2.ts" code lang="ts" no-name -->

```ts
import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

type ApplePaySessionLike = {
  onvalidatemerchant?: (event: { validationURL: string }) => void;
  onpaymentauthorized?: (event: { payment: { token: unknown } }) => void;
  begin: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
  abort: () => void;
};

type ApplePaySessionConstructor = {
  new (version: number, paymentRequest: unknown): ApplePaySessionLike;
  supportsVersion: (version: number) => boolean;
  canMakePayments: () => boolean;
  STATUS_SUCCESS: number;
};

const { totalPrice } = useCart();
const { activeBillingAddress } = useSessionContext();
const divContainer = ref<HTMLElement>();

async function renderApplePay() {
  const ApplePaySession = (
    window as unknown as {
      ApplePaySession?: ApplePaySessionConstructor;
    }
  ).ApplePaySession;

  if (
    !ApplePaySession?.supportsVersion(4) ||
    !ApplePaySession.canMakePayments()
  ) {
    throw new Error("Browser does not support Apple Pay");
  }

  const paypal = getPayPal();
  const {
    isEligible,
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
  } = await paypal.Applepay().config();

  if (!isEligible) {
    throw new Error("Funding for Apple Pay is not eligible");
  }

  const address = activeBillingAddress.value;
  if (!address) {
    throw new Error("Billing address is required for Apple Pay");
  }

  const billingContact = {
    addressLines: [address.street ?? ""],
    administrativeArea: address.countryState?.name,
    country: address.country?.iso3,
    countryCode: address.country?.iso,
    familyName: address.lastName,
    givenName: address.firstName,
    locality: address.city,
    postalCode: address.zipcode,
  };

  const paymentDataRequest = {
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
    billingContact,
    requiredShippingContactFields: [],
    requiredBillingContactFields: [],
    total: {
      label: "TOTAL",
      type: "final",
      amount: String(totalPrice.value),
    },
  };

  const button = document.createElement("apple-pay-button");
  button.setAttribute("buttonStyle", "black");
  button.setAttribute("type", "buy");
  button.addEventListener("click", () => {
    // do some form validity checks before continue

    const session = new ApplePaySession(4, paymentDataRequest);

    session.onvalidatemerchant = (event) => onValidateMerchant(session, event);
    session.onpaymentauthorized = (event) =>
      onPaymentAuthorized(session, billingContact, event.payment.token);

    session.begin();
  });

  divContainer.value?.appendChild(button);
}

async function onValidateMerchant(
  session: ApplePaySessionLike,
  event: { validationURL: string },
) {
  try {
    const { merchantSession } = await getPayPal().Applepay().validateMerchant({
      validationUrl: event.validationURL,
    });

    session.completeMerchantValidation(merchantSession);
  } catch {
    session.abort();
  }
}

async function onPaymentAuthorized(
  session: ApplePaySessionLike,
  billingContact: ApplePayJS.ApplePayPaymentContact,
  paymentToken: unknown,
) {
  try {
    const orderId = await createOrder("applepay");

    await getPayPal().Applepay().confirmOrder({
      orderId,
      token: paymentToken,
      billingContact,
    });

    const ApplePaySession = (
      window as unknown as {
        ApplePaySession: ApplePaySessionConstructor;
      }
    ).ApplePaySession;
    session.completePayment(ApplePaySession.STATUS_SUCCESS);

    await onApprove({ orderID: orderId });
  } catch {
    session.abort();
  }
}

export { renderApplePay };
```

<!-- /automd -->
