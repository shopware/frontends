---
head:
  - - meta
    - name: og:title
      content: "Payments"
  - - meta
    - name: og:description
      content: "In this chapter you will learn how to integrate payments."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Working%20with%20**Payments**.png"
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# Payments

:::tip Advanced Guide - prior knowledge required
In order to follow this guide properly, we recommend that you get familiar with the payment flow and payment API concepts first.

- [Payments Concept](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments) - especially `asynchronous` and `synchronous` chapters.
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)
  :::

## Synchronous Payment

Due to the fact the order can be placed without giving any additional payment information (only allowed data is a `customer comment` and `affiliate code`), the synchronous payment strongly depends on the specific implementation, and that's why it does not affect the way how to deal it in the headless client application.

In this case, the flow looks as follows:

```js
// the cart contains at least one item added
const { createOrder } = useCheckout();

// create an order from the current Cart
const order = await createOrder(/** optional params omitted */);
// order object on success, unhandled rejection otherwise
```

Under the hood, once the order is placed, a [PaymentHandler](https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin#synchronous-example) is being invoked to process the payment right away:

- Execute the payment logic (may vary for every payment method / provider)
- Change the payment status according the result from previous step

In general, the client side does not have any direct control on the sync payment process.

## Asynchronous Payment

Contrary to the sync flow, the asynchronous payment has more options and thus, more control of the payment process.

This is a better option for those payment providers that would need to pass additional data (like credentials, one time tokens) to complete the payment process.

### External gateway

To give an example, let's say we need to implement a payment method which redirects a customer to the external payment gateway. Depending on success or failure, we need to be redirected to success page in case of payment was done properly, otherwise display an error page to the user in our shop page.

1. Create an order

   ```js{3}
   const { createOrder } = useCheckout();
   const { refreshCart } = useCart();
   // create an order
   const order = await createOrder();
   ```

2. Utilize `useOrderPayment` composable to proceed the payment process once order is placed

   ```js
   // utilize useOrderPayment to proceed on the provided order
   const { paymentUrl, handlePayment, isAsynchronous, state, paymentMethod } =
     useOrderPayment(ref(order));
   ```

3. Initialize a payment handler

   This is the moment, when any additional information can be passed (if a payment extension allows to do so). Payment handler can communicate with an external service to init some additional process, like preparation of external gateway session to process the payment for specific order.

   ```js{6-15}
   // where to redirect an user when payment is done correctly
   const SUCCESS_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/paid`;
   // go to this page otherwise
   const FAILURE_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/unpaid`;

   const handlePaymentResponse = await handlePayment(
     SUCCESS_PAYMENT_URL,
     FAILURE_PAYMENT_URL,
     {
       /**
        * here goes additional information required by payment provider
       * can be payment intent token
       */
     }
   )
   ```

   Note that, this is an example, does not show how to create success/failure pages.

4. Do the action on processed payment handler

   If payment provider (shipped via app/plugin/extension) has external payment gateway, you will probably get the URL to go to.

   ```js
   const handlePaymentResponse = await handlePayment();
   /* parameters omitted, see previous point */

   const redirectUrl = handlePaymentResponse?.redirectUrl; // URL or undefined
   ```

   Then you are ready to perform a redirection of an user to the URL in order to finish the payment.
   If succeed, the customer will be redirected back to `SUCCESS_PAYMENT_URL` defined before. Otherwise, `FAILURE_PAYMENT_URL` will be displayed.

### Credit cards

Flow for the credit cards may vary between providers, nevertheless there is a general rule: asynchronous payment flow applies also in this case. Because there is always additional data to be sent, like one time tokens, hash and other security solutions.

Sometimes the external authorization is needed and the external gateway can be used, or a popup to interact with payment provider.

However, if there are no plugin-specific endpoints to interact with, the `handlePayment` method (or `/store-api/handle-payment` endpoint) is always a good choice.

---

See what can be achieved on Express Checkout example for PayPal provider.

<PageRef page="../../../resources/integrations/payments/" title="Payment Integrations" sub="See also all our Payment Integrations." />
