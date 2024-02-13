---
head:
  - - meta
    - name: og:title
      content: "Custom payment"
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to implement a custom payment flow based on PayPal Express Checkout."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Custom%20**Payment**%20Process.png"
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# Custom payment flow based on PayPal Express Checkout

<img src="../../.assets/payment-icons/paypal-express.png" alt="Paypal Express Logo" class="mb-8 h-20" />

:::tip Advanced Guide - prior knowledge required
In order to follow this guide properly, we recommend that you get familiar with the payment flow and payment API concepts first.

- [Payment Flow in Shopware 6](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments)
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)
  :::

In this chapter you will learn how to integrate a payment flow with Shopware Frontends. There are various ways in which payment providers integrate with Shopware's API, so it is likely that you need to consult the documentation of your payment provider to get the details.

This specific guides shows how to integrate the **PayPal Express Checkout**. However, the general flow is the same for all payment providers, so you will be able to use this guide as a reference for different providers.

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

The [SwagPayPal](https://github.com/shopwareLabs/SwagPayPal) extension is available on Shopware Cloud stores and also can be installed manually in self-managed instances. It provides useful endpoints to conduct payments with PayPal. We will be using two PayPal-specific endpoints in this guide:

### Create order

`/store-api/paypal/express/create-order`

- Creates an order directly with PayPal which contains information about the cart and the user
- Returns a payment intent token that identifies the order in PayPal

### Prepare checkout

`/store-api/paypal/express/prepare-checkout`

- Used after PayPal approved the payment process request
- Registers a customer based on PayPal account's data (name, address, email) and logs them in
- The API Client receives a new context token that points to the logged-in customer

## Embed Express Payment buttons

The next step is to embed the PayPal Express Checkout buttons in your frontend using the PayPal Javascript SDK. The SDK can be loaded from the PayPal CDN or using an npm package ([PayPal SDK Documentation](https://developer.paypal.com/sdk/js/configuration/)). In our example we're going to use the second option.

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

### Register the buttons

In order to display a PayPal Button component, we need to mount it in the DOM.

```ts
// client only
window
  .paypal?
  .Buttons({/** configuration skipped */})
  .mount("#paypal-buttons-container")
// this script will mount the component in element with id="paypal-buttons-container"
```

## React on PayPal events

Now, that the buttons are properly displayed, we need to react to two basic events.

- `createOrder`
- `onApprove`

There are additional events like `onInit`, `onCancel` or `onError` (and more) to be used on specific cases, which we are not going to cover in this guide.

### `createOrder` event

In the `creatOrder` callback, you need to prepare the PayPal order and return a token that identifies the order in PayPal. This token will be used later on to capture the payment.
It is called when the user clicks on the PayPal express checkout button.

```ts{7-20}
// client only
window
  .paypal?
  .Buttons({
      createOrder: async (
        data: CreateOrderData,
        actions: CreateOrderActions
      ) => {
        await setPaymentMethod(paypalMethod.value);

        await addToCart();

        const response = await apiInstance.invoke.post<{ token: string }>(
          "/store-api/paypal/express/create-order"
        );
        return response?.data?.token;
      },
  })
  .mount("#paypal-buttons-container")
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
    await apiInstance.invoke.post(
      "/store-api/paypal/express/prepare-checkout",
      {
        token: data.orderID,
      }
    );
    // createOrder from useCheckout composable
    orderCreated.value = await createOrder();
    refreshCart()
    // apiInstance from useShopwareContext composable
    const handlePaymentResponse = await apiInstance.invoke.post(
      "/store-api/handle-payment",
      {
        orderId: orderCreated.value.id,
        successUrl: `${window.location.origin}/order/success?order=${orderCreated.value.id}&success=true`,
        errorUrl: `${window.location.origin}/order/success?order=${orderCreated.value.id}&success=false`,
      }
    );
    redirectPaymentUrl.value = handlePaymentResponse?.data?.redirectUrl;
    //
  },
  ...
```

The example above shows the code that is executed after a payer approves the PayPal popup. This function calls the `prepare-checkout` endpoint to register the upcoming PayPal transaction.

::: tip Call custom endpoints
You can call custom endpoints using the `apiInstance.invoke.post()`, `.get()`, `.put()` or `.delete()` methods. They will automatically add the `sw-context-token` header to authenticate the request.
:::

Thanks to the internal logic of the PayPal extension, the is already connected with the logged in customer. Now you can call `createOrder()` which creates an order through the Store-API. Once the order is created, its `id` can be used to invoke the `handle-payment` action to process payment. This action captures the money or redirects the user to an external payment gateway.

## Working example

The example shows the specific case, when a product can be bought in one action from the frontend.

<StackBlitzLiveExample projectPath="shopware/frontends/tree/main/examples/express-checkout" openPath="/" />
