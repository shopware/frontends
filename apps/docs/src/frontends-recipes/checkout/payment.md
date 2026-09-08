---
nav:
  position: 40
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useOrderPayment
    - useOrderDetails
  helpers: []
  operations:
    - handlePaymentMethod post /handle-payment
    - orderSetPayment post /order/payment
    - readOrder post /order
    - readPaymentMethod post /payment-method
  schemas:
    - Order
    - OrderTransaction
    - StateMachineState
    - PaymentMethod
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Land on the return page",
    detail:
      "The order already exists. The confirmation route only knows the order id from the URL, so it has to load the order before anything about the payment is known.",
    code: "const { order, loadOrderDetails } = useOrderDetails(orderId)",
    state: "route param orderId",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Read the order",
    detail:
      "readOrder returns the order with its transactions and, separately, a paymentChangeable map keyed by order id. The transactions are what carry the payment state.",
    code: 'apiClient.invoke("readOrder post /order", { body: { ids: [orderId] } })',
    state: "swOrderDetails",
    typeKeys: ['operations["readOrder post /order"]["response"]'],
  },
  {
    title: "Composable",
    action: "Pick the transaction",
    detail:
      "useOrderPayment takes the order ref and derives activeTransaction as the first transaction whose payment method is active. state and paymentMethod are read from it.",
    code: "const { state, activeTransaction } = useOrderPayment(order)",
    state: "activeTransaction",
    typeKeys: ['Schemas["OrderTransaction"]'],
  },
  {
    title: "Store API",
    action: "Start the payment",
    detail:
      "handlePayment posts the order id plus a finish and an error URL. The response carries a redirectUrl and nothing else — no state, no order.",
    code: "await handlePayment(finishUrl, errorUrl)",
    state: "paymentUrl",
    typeKeys: [
      'operations["handlePaymentMethod post /handle-payment"]["response"]',
    ],
  },
  {
    title: "Browser",
    action: "Leave the application",
    detail:
      "For an external provider the frontend performs a full page navigation to paymentUrl. Nothing in the SPA survives, which is why the finish and error URLs must be absolute.",
    code: "window.location.href = paymentUrl",
    state: "none, the page unloads",
    typeKeys: [],
  },
  {
    title: "Return",
    action: "Read the state again",
    detail:
      "The provider redirects to finishUrl or errorUrl. That page loads the order once more and reads state.technicalName, because the redirect itself proves nothing.",
    code: "state?.technicalName === 'paid'",
    state: "StateMachineState",
    typeKeys: ['Schemas["StateMachineState"]'],
  },
  {
    title: "Recovery",
    action: "Change the method",
    detail:
      "When the payment failed and paymentChangeable allows it, orderSetPayment swaps the method on the order. useOrderPayment does not reload the order afterwards.",
    code: "await changePaymentMethod(id); await loadOrderDetails()",
    state: "swOrderDetails",
    typeKeys: ['operations["orderSetPayment post /order/payment"]["body"]'],
  },
];
</script>

# Payment Handling and Return Flow

## Goal

Trigger the payment for an order that already exists, send the customer to an external provider, and read the result when they come back. The important part is that the redirect back to your application is not proof of anything — the payment state lives on the order transaction and has to be read again.

## Shopware Flow

Payment is not part of order placement. `POST /checkout/order` creates the order and returns it; the payment starts afterwards with `POST /handle-payment`. That separation is the reason a confirmation page needs both an order request and a payment request.

`POST /handle-payment` responds with a single field, `redirectUrl`. It does not tell you whether the payment succeeded, and it does not return the order. The state is on the order transaction, so the return page must call `readOrder post /order` again and read `stateMachineState.technicalName`.

<RecipeFlowDiagram label="Payment flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The confirmation route receives an order id and loads the order with `useOrderDetails(orderId).loadOrderDetails()`.
2. `readOrder post /order` returns the order with its `transactions`, plus a `paymentChangeable` map.
3. `useOrderPayment(order)` derives `activeTransaction`, `state`, `paymentMethod` and `isAsynchronous` from that order.
4. `handlePayment(finishUrl, errorUrl)` sends `POST /handle-payment` and stores the returned `redirectUrl` in `paymentUrl`.
5. The frontend navigates the browser to `paymentUrl`, leaving the application entirely.
6. The provider returns the customer to `finishUrl` or `errorUrl`, where the order is loaded again and `state.technicalName` is read.
7. If the payment failed and `paymentChangeable` allows it, `changePaymentMethod(id)` swaps the method — and the UI reloads the order itself.

You do not pass the payment method to `handlePayment`. It is taken from the order transaction, which is why changing it needs its own `orderSetPayment post /order/payment` request.

## Request Flow

| Step                      | Code                                   | Store API              | Type                                                                                                |
| ------------------------- | -------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Load the order            | `loadOrderDetails()`                   | `POST /order`          | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />                    |
| Start the payment         | `handlePayment(finishUrl, errorUrl)`   | `POST /handle-payment` | <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["body"]' />     |
| Read the redirect target  | `paymentUrl`                           | `POST /handle-payment` | <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["response"]' /> |
| List selectable methods   | `getPaymentMethods()`                  | `POST /payment-method` | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />   |
| Change the payment method | `changePaymentMethod(paymentMethodId)` | `POST /order/payment`  | <SchemaTypeTooltip type-key='operations["orderSetPayment post /order/payment"]["body"]' />          |
| Read the payment state    | `state?.technicalName`                 | `POST /order`          | <SchemaTypeTooltip type-key='Schemas["StateMachineState"]' />                                       |

`getPaymentMethods()` here is the one on `useOrderDetails`, which sends `{ onlyAvailable: true }` in the request **body**. It returns the array directly instead of caching it, unlike the identically named method on `useCheckout`.

## Composables

- `useOrderPayment`: takes a `ComputedRef<Order>` and owns the payment side of it. Exposes `activeTransaction`, `state`, `paymentMethod`, `isAsynchronous`, the `paymentUrl` ref, `handlePayment` and `changePaymentMethod`.
- `useOrderDetails`: supplies the order that `useOrderPayment` reads. Provides `loadOrderDetails`, `paymentChangeable`, `getPaymentMethods`, and its own `handlePayment` and `changePaymentMethod` that reload the order for you.

## Types

Use generated Store API types when you need to type the payment request, the transaction, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["body"]' />
  <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["response"]' />
  <SchemaTypeTooltip type-key='operations["orderSetPayment post /order/payment"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderTransaction"]' />
  <SchemaTypeTooltip type-key='Schemas["StateMachineState"]' />
  <SchemaTypeTooltip type-key='Schemas["PaymentMethod"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type HandlePaymentBody =
  operations["handlePaymentMethod post /handle-payment"]["body"];
type HandlePaymentResponse =
  operations["handlePaymentMethod post /handle-payment"]["response"];
type SetPaymentBody = operations["orderSetPayment post /order/payment"]["body"];
type OrderTransaction = Schemas["OrderTransaction"];
type PaymentState = Schemas["StateMachineState"];
type Order = Schemas["Order"];
```

`HandlePaymentResponse` is `{ redirectUrl: string }`. Reading that type is the fastest way to see why the return page cannot skip reloading the order.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const orderId = useRoute().params.id as string;

const { order, loadOrderDetails, paymentChangeable, getPaymentMethods } =
  useOrderDetails(orderId);
const { state, paymentMethod, paymentUrl, handlePayment, changePaymentMethod } =
  useOrderPayment(order);

const selectableMethods = ref<Schemas["PaymentMethod"][]>([]);
const isWorking = ref(false);
const paymentError = ref("");

const isPaid = computed(() => state.value?.technicalName === "paid");
const isOpen = computed(() => state.value?.technicalName === "open");

onMounted(async () => {
  await loadOrderDetails();

  if (isOpen.value) {
    const origin = window.location.origin;
    try {
      await handlePayment(
        `${origin}/checkout/success/${orderId}`,
        `${origin}/checkout/error/${orderId}`
      );
    } catch {
      paymentError.value = "The payment could not be started.";
    }
  }

  if (paymentChangeable.value) {
    selectableMethods.value = await getPaymentMethods();
  }
});

const isRedirectable = computed(() => {
  if (typeof paymentUrl.value !== "string") return false;

  try {
    new URL(paymentUrl.value);
    return true;
  } catch {
    return false;
  }
});

const goToPaymentProvider = () => {
  if (isRedirectable.value) {
    window.location.href = paymentUrl.value as string;
  }
};

watch(isRedirectable, (canRedirect) => {
  if (canRedirect) goToPaymentProvider();
});

const switchMethod = async (paymentMethodId: string) => {
  paymentError.value = "";
  isWorking.value = true;

  try {
    await changePaymentMethod(paymentMethodId);
    await loadOrderDetails();
  } catch {
    paymentError.value = "The payment method could not be changed.";
  } finally {
    isWorking.value = false;
  }
};
</script>

<template>
  <p v-if="!order">Loading your order…</p>

  <div v-else>
    <p>Order {{ order.orderNumber }}</p>
    <p>Payment method: {{ paymentMethod?.name }}</p>
    <p>Payment state: {{ state?.translated?.name ?? state?.name }}</p>

    <p v-if="paymentError">{{ paymentError }}</p>

    <p v-if="isPaid">Your payment was received.</p>

    <div v-else-if="isOpen">
      <p>Your payment is still open.</p>
      <button
        v-if="isRedirectable"
        type="button"
        @click="goToPaymentProvider()"
      >
        Continue to the payment provider
      </button>
    </div>

    <fieldset v-if="paymentChangeable && !isPaid">
      <legend>Pay with a different method</legend>
      <button
        v-for="method in selectableMethods"
        :key="method.id"
        type="button"
        :disabled="isWorking || method.id === paymentMethod?.id"
        @click="switchMethod(method.id)"
      >
        {{ method.name }}
      </button>
    </fieldset>
  </div>
</template>
```

## State And Session

The order is not part of the sales channel context, but reading it still depends on the `sw-context-token`: `readOrder post /order` returns the orders of the customer that the token resolves to. A return page therefore has to run in the same session, which is why a guest returning from a provider needs the deep link flow rather than a plain order id.

`useOrderDetails` keeps the loaded order in the `swOrderDetails` injection, so `useOrderPayment(order)` and the summary on the page read the same object. `paymentUrl` is a plain `Ref` on each composable instance and is not shared — it is set only by the `handlePayment` call you made yourself.

Nothing in the frontend advances the payment state. `stateMachineState.technicalName` moves from `open` to `paid` on the server, so after a return the only reliable action is to load the order again.

## Edge Cases

- `useOrderPayment().handlePayment()` returns `undefined` without sending anything when the order ref is still empty. Await `loadOrderDetails()` before calling it, or the payment silently never starts.
- `useOrderPayment().changePaymentMethod()` does **not** reload the order. `useOrderDetails().changePaymentMethod()` does. Mixing them up leaves the page showing the previous method.
- `activeTransaction` on `useOrderPayment` is the first transaction whose `paymentMethod.active` is `true`, while `useOrderDetails().paymentMethod` reads the **last** transaction. After a method change an order has several transactions and the two disagree.
- `isAsynchronous` reads `paymentMethod.asynchronous`, which was removed from the `PaymentMethod` schema in 6.7. Against a current schema the value is `undefined`, so gating a "continue to payment" button on it hides the button. Gate on `paymentUrl` and `state.technicalName` instead.
- The declared type of `handlePayment` accepts a third `paymentDetails` argument, but neither implementation forwards it to the request body. A prepared payment flow that needs extra transaction fields has to call `apiClient.invoke("handlePaymentMethod post /handle-payment")` directly.
- `finishUrl` and `errorUrl` are optional in the schema, and omitting them leaves the return target to the payment handler. Pass absolute URLs built from `window.location.origin` — they are used after the browser has left your application.
- `redirectUrl` can be an empty string or a value that is not a URL for a synchronous method. Validate it with `new URL()` before assigning `window.location.href`.
- `paymentChangeable` is a map keyed by order id in the `readOrder` response, exposed as a boolean for the current order. It defaults to `false`, so a page that renders the method switcher before the order has loaded shows nothing.
- A customer can close the provider tab and come back later. Treat `open` as a resumable state rather than a failure.

## Common Mistakes

- Do not treat the redirect back to `finishUrl` as a successful payment. Load the order and read the state.
- Do not call `handlePayment()` before the order is loaded.
- Do not redirect to `paymentUrl` without validating it.
- Do not use relative paths for `finishUrl` and `errorUrl`.
- Do not render the payment button behind `isAsynchronous` alone.
- Do not change the payment method without checking `paymentChangeable` — the request fails for orders the server has locked.
- Do not expose the raw provider or API error text. Map it to a message that tells the customer whether they were charged.

## Testing Checklist

- The return page loads the order before any payment request is sent.
- `handlePayment()` with an unloaded order issues no request.
- A successful `handlePaymentMethod post /handle-payment` sets `paymentUrl` from `redirectUrl`.
- A `paymentUrl` that is not a valid URL does not trigger a navigation.
- Returning with a `paid` state renders the success branch without a further payment request.
- Returning with an `open` state offers a way to resume the payment.
- `changePaymentMethod` calls `orderSetPayment post /order/payment` and the rendered method updates only after the order is reloaded.
- The method switcher is hidden while `paymentChangeable` is `false`.
- A failing payment request shows a UI-level error and leaves the order state untouched.

## Related Links

- [Payments documentation](../../getting-started/e-commerce/payments.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
