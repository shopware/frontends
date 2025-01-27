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
import StackBlitzLiveExample from '../../../components/StackBlitzLiveExample.vue'
</script>

# PayPal Integration

<img src="../../../.assets/payment-icons/paypal.png" alt="Paypal Logo" class="mb-8 h-20" />

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

```ts
import { loadScript } from "@paypal/paypal-js";

loadScript({
  // client id is generated in the PayPal account's apps section
  "client-id":
    "AUAcLFoadrmy9JiW2cHgriy1mTy0MCqQOP_1SSeQEUArz_zPeF1VcNY2CCxcFBQpf_N4g1k5wFVNJ1Bk",
  currency: "EUR", // or use some reference to the current currency
  locale: "en_US", // as same as in the field above
});
```

Now, the `paypal` object will be available in the global `window` object.

Alternatively, the `loadScript` function returns a promise resolving to the paypal object. This can be useful if you want to load the script multiple times with different options. Note that you must delete `window.paypal` first.

### Register the buttons

In order to display a PayPal Button component, we need to mount it in the DOM.

```ts
const divContainer = ref();

// client only
window
  .paypal
  .Buttons({/** configuration skipped */})
  .render(divContainer)
// this script will mount the component in element `divContainer`
```

## React on PayPal events

Now, that the buttons are properly displayed, we need to react to two basic events.

- `createOrder`
- `onApprove`

There are additional events like `onInit`, `onClick`, `onCancel` or `onError` (and more) to be used on specific cases, which we are not going to cover in this guide.

### `createOrder` event

In the `creatOrder` callback, you need to prepare the PayPal order and return a token that identifies the order in PayPal. This token will be used later on to capture the payment.
It is called when the user clicks on the PayPal checkout button.

```ts
const divContainer = ref();

// client only
window
  .paypal
  .Buttons({
      createOrder: async (
        data: CreateOrderData,
        actions: CreateOrderActions
      ) => {
        const response = await apiClient.invoke(
          "createPayPalOrder post /store-api/paypal/create-order"
        );
        return response.data?.token;
      },
  })
  .render(divContainer)
```

### `createOrder` event (Express)

In the `creatOrder` callback, you need to prepare the PayPal order and return a token that identifies the order in PayPal. This token will be used later on to capture the payment.
It is called when the user clicks on the PayPal express checkout button.

```ts
const divContainer = ref();

// client only
window
  .paypal
  .Buttons({
      createOrder: async (
        data: CreateOrderData,
        actions: CreateOrderActions
      ) => {
        await setPaymentMethod(paypalMethod.value);

        await addToCart();

        const response = await apiClient.invoke(
          "createPayPalExpressOrder post /store-api/paypal/express/create-order"
        );
        return response.data?.token;
      },
  })
  .render(divContainer)
```

The approach here is to set the payment method internally, then add a current product to the cart, and then prepare a PayPal token to be used later on.

In the example above we do a couple of things:

1.  Set the payment method for the current context
2.  Add a product to the cart
3.  Create a PayPal order and return the token

### `onApprove` event

This event is called when the user approves the payment process. It's the last step before the payment is captured.

```ts
  ...
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, actions: OnApproveActions) => {
    // createOrder from useCheckout composable
    orderCreated.value = await createOrder({
      paypalOrderId: data.orderID,
    });
    refreshCart()
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
  ...
```

The example above shows the code that is executed after a payer approves the PayPal popup. This function calls `createOrder()` which creates an order through the Store-API. Once the order is created, its `id` can be used to invoke the `handle-payment` action to process payment. This action captures the money or redirects the user to an external payment gateway.

### `onApprove` event (Express)

This event is called when the user approves the payment process. It's the last step before the payment is captured.

```ts
  ...
  // part of window.paypal.Buttons({}) params
  onApprove: async (data: OnApproveData, actions: OnApproveActions) => {
    await apiClient.invoke(
      "preparePayPalExpressCheckout post /store-api/paypal/express/prepare-checkout",
      {
        body: { token: data.orderID },
      }
    );
    // createOrder from useCheckout composable
    const order = await createOrder({ paypalOrderId: data.orderID });
    refreshCart()

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
  ...
```

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

```ts
async function createOrder(product?: 'paylater' | 'acdc' | 'applepay' | 'googlepay' | 'applepay' | 'venmo') {
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
  refreshCart()
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
  ...
}
```

### Load the PayPal SDK including the additional payment methods

Depending on the type of the payment method and how it integrates with PayPal, you need to add it to `enable-funding` or `components`:

```ts
import { loadScript } from "@paypal/paypal-js";

loadScript({
  // Pay Later or venmo
  "enable-funding": "paylater,venmo",
  // ACDC, Apple Pay or Google Pay
  components: "card-fields,applepay,googlepay",
  ...
});
```

### Pay Later

```ts
const divContainer = ref();

window
  .paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYLATER,
    createOrder: createOrder.bind(this, "paylater"),
    onApprove: onApprove.bind(this),

    // ...
  })
  .render(divContainer)
```

### Venmo

```ts
const divContainer = ref();

window
  .paypal
  .Buttons({
    fundingSource: paypal.FUNDING.VENMO,
    createOrder: createOrder.bind(this, "venmo"),
    onApprove: onApprove.bind(this),

    // ...
  })
  .render(divContainer)
```

### Credit card (ACDC)

```ts
const cardFields = paypal.CardFields({
  createOrder: createOrder.bind(this, "acdc"),
  onApprove: onApprove.bind(this),
  style: {/** some custom styling */},
})

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

Upon form submit via your own rendered button you need to check the validity of the card fields:

```ts
async function onFormSubmit() {
  const cardState = await cardFields.getState();

  if (state.isFormValid) {
    // This will trigger the `onApprove` event
    cardFields.submit();

    return;
  }

  // Do some advanced error handling, e.g. focus the invalid field
  const firstInvalidFieldKey = Object.keys(state.fields).find((key) => !state.fields[key].isValid);
  this.fields[firstInvalidFieldKey]?.focus();
}
```

After submitting the card fields, the `onApprove` event will be triggered.

### Google Pay

For Google Pay to work, you need to load the Google Pay script in the head of your HTML document.

```html
<head>
  <script src="https://pay.google.com/gp/p/js/pay.js"></script>
  <!-- ... -->
</head>
```

Now you can render the Google Pay button in your frontend:

```ts
const { cart, totalPrice } = useCart();
const { currency } = useSessionContext();
const divContainer = ref();

async function renderGooglePay() {
  if (!window?.google?.payments?.api?.PaymentsClient) {
    throw new Error("Google Pay script is not load");
  }

  const {
    isEligible,
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    countryCode,
  } = await window.paypal.Googlepay().config();

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
        } catch (e) {
          return {
            transactionState: "ERROR",
            error: { intent: "PAYMENT_AUTHORIZATION", message: e.message || "TRANSACTION FAILED" },
          }
        }
      },
    },
  });

  const { result } = await gpClient.isReadyToPay({ apiVersion, apiVersionMinor, allowedPaymentMethods });
  if (!result) {
    throw new Error("Browser does not support Google Pay");
  }

  const paymentDataRequest = {
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
    transactionInfo: {
      countryCode,
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Grand Total",
      currencyCode: currency.value.isoCode,
      totalPrice: totalPrice.value,
      displayItems: [
        {
          label: "Subtotal",
          price: cart.price.netPrice,
          type: "SUBTOTAL",
        },
        {
          label: "Tax",
          price: cart.price.calculatedTaxes.price,
          type: "TAX",
        }
      ],
    },
  };

  gpClient.prefetchPaymentData(paymentDataRequest);

  const button = gpClient.createButton({
    allowedPaymentMethods,
    onClick: () => {
      // do some form validity checks before continue

      gpClient.loadPaymentData(paymentDataRequest).catch();
    },
  });
  
  divContainer.appendChild(button);
}

async function onPaymentAuthorized(paymentData) {
  const orderId = await createOrder("googlepay");

  if (!orderId) {
    throw new Error("PayPal order could not be created")
  }

  const confirmOrderResponse = await window.paypal.Googlepay().confirmOrder({
    orderId,
    paymentMethodData: paymentData.paymentMethodData,
  });

  if (!["APPROVED","PAYER_ACTION_REQUIRED"].includes(confirmOrderResponse.status)) {
    throw new Error("PayPal didn't approve the transaction.");
  }

  if ("PAYER_ACTION_REQUIRED" === confirmOrderResponse.status) {
    await window.paypal.Googlepay().initiatePayerAction({orderId});
  }

  this.onApprove({ orderId });
}
```

### Apple Pay

For Apple Pay to work, you need to load the Apple Pay script in the head of your HTML document.

```html
<head>
  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <!-- ... -->
</head>
```

Now you can render the Apple Pay button in your frontend:

```ts
const { totalPrice } = useCart();
const { activeBillingAddress } = useSessionContext();
const divContainer = ref();

async function renderApplePay() {
  if (!window.ApplePaySession?.supportsVersion(4) || !window.ApplePaySession?.canMakePayments()) {
    throw new Error("Browser does not support Apple Pay");
  }

  const {
    isEligible,
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
  } = await window.paypal.Applepay().config();

  if (!isEligible) {
    throw new Error("Funding for Apple Pay is not eligible");
  }

  const billingContact = {
    addressLines: [activeBillingAddress.street],
    administrativeArea: activeBillingAddress.countryState?.name,
    country: activeBillingAddress.country?.iso3,
    countryCode: activeBillingAddress.country?.iso,
    familyName: activeBillingAddress.lastName,
    givenName: activeBillingAddress.firstName,
    locality: activeBillingAddress.city,
    postalCode: activeBillingAddress.zipcode,
  }

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
      amount: totalPrice.value,
    },
  };

  const button = document.createElement("apple-pay-button");
  button.setAttribute("buttonStyle", "black");
  button.setAttribute("type", "buy");
  button.addEventListener("click",() => {
    // do some form validity checks before continue

    const session = new window.ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = this.onValidateMerchant.bind(this, session);
    session.onpaymentauthorized = this.onPaymentAuthorized.bind(this, session, billingContact);

    session.begin();
  });
  
  divContainer.appendChild(button);
}

async function onValidateMerchant(session, event) {
  try {
    const { merchantSession } = await window.paypal.Applepay().validateMerchant({
      validationUrl: event.validationURL,
    });

    session.completeMerchantValidation(merchantSession);
  } catch (e) {
    session.abort();
  }
}

async function onPaymentAuthorized(session, billingContact, paymentData) {
  try {
    const orderId = await createOrder("applepay");

    await paypal.Applepay().confirmOrder({
      orderId,
      token: event.payment.token,
      billingContact,
    });

    session.completePayment(window.ApplePaySession.STATUS_SUCCESS);

    this.onApprove({ orderId });
  } catch (e) {
    session.abort();
  }
}
```
