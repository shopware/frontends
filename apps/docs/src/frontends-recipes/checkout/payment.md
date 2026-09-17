---
nav:
  position: 20
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useOrderPayment
    - useOrderDetails
    - useDefaultOrderAssociations
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
import CodeExample from "../../components/CodeExample.vue";

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
    code: 'apiClient.invoke("readOrder post /order", { body: { ids: [orderId], associations, checkPromotion: true } })',
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
    title: "UI",
    action: "Read the state again",
    detail:
      "The provider redirects to finishUrl or errorUrl. That page loads the order once more and reads state.technicalName, because the redirect itself proves nothing.",
    code: "state?.technicalName === 'paid'",
    state: "StateMachineState",
    typeKeys: ['Schemas["StateMachineState"]'],
  },
  {
    title: "Composable",
    action: "Change the method",
    detail:
      "When the payment failed and paymentChangeable allows it, orderSetPayment swaps the method on the order. useOrderPayment does not reload the order afterwards.",
    code: "await changePaymentMethod(id); await loadOrderDetails()",
    state: "swOrderDetails",
    typeKeys: ['operations["orderSetPayment post /order/payment"]["body"]'],
  },
];
</script>

# Payment

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

You do not pass the payment method to `handlePayment`, and you do not build the order criteria: it is taken from the order transaction, and `loadOrderDetails` already sends the associations and the `checkPromotion` flag the rest of this page depends on.

## Request Flow

| Step                        | Code                                   | Store API              | Type                                                                                                                                                                                                |
| --------------------------- | -------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Load the order              | `loadOrderDetails()`                   | `POST /order`          | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />                                                                                                                    |
| Start the payment           | `handlePayment(finishUrl, errorUrl)`   | `POST /handle-payment` | <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["body"]' /> <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["response"]' /> |
| List selectable methods     | `getPaymentMethods()`                  | `POST /payment-method` | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />                                                                                                   |
| Change the payment method   | `changePaymentMethod(paymentMethodId)` | `POST /order/payment`  | <SchemaTypeTooltip type-key='operations["orderSetPayment post /order/payment"]["body"]' />                                                                                                          |
| Re-read the state on return | `loadOrderDetails()`                   | `POST /order`          | <SchemaTypeTooltip type-key='Schemas["StateMachineState"]' />                                                                                                                                       |

`getPaymentMethods()` here is the one on `useOrderDetails`, which sends `{ onlyAvailable: true }` in the request **body**. It returns the array directly instead of caching it, unlike the identically named method on `useCheckout`.

## Composables

Pick by scope — how much of the order the composable is about:

| Composable        | Scope                          | Reach for it when                                                                             |
| ----------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `useOrderDetails` | one order and its associations | loading the order, reading totals and addresses, checking whether the method may still change |
| `useOrderPayment` | the payment side of that order | starting the payment, reading the transaction state, switching the method                     |

`useOrderPayment` is the one this recipe is about:

- **Read** — `activeTransaction`, `state`, `paymentMethod`, `isAsynchronous`.
- **Write** — `handlePayment(finishUrl, errorUrl)`, `changePaymentMethod(paymentMethodId)`.
- **Redirect** — `paymentUrl`, a plain `Ref` that only `handlePayment` writes to.

Six things the generated reference will not tell you:

- `useOrderPayment` takes a `ComputedRef<Order | null | undefined>` rather than an id, so it reads whatever `useOrderDetails` has loaded. Both of its writes return `undefined` **without sending anything** while that ref is empty — `await loadOrderDetails()` first, or the payment silently never starts.
- Neither `handlePayment` nor `changePaymentMethod` on `useOrderPayment` reloads the order. On `useOrderDetails` only `changePaymentMethod` (and `cancel`) does; its `handlePayment` does not reload either. After switching the method through `useOrderPayment`, call `loadOrderDetails()` yourself or the page keeps showing the previous method.
- `activeTransaction` is the **first** transaction whose `paymentMethod.active` is `true`, while `useOrderDetails().paymentMethod` reads the **last** transaction. After a method change an order has several transactions and the two disagree.
- `isAsynchronous` is `paymentMethod.asynchronous && paymentMethod.afterOrderEnabled`. `afterOrderEnabled` is still part of the schema, but `asynchronous` was removed from `PaymentMethod` in 6.7, so against a current backend the whole expression is `undefined`. Gate a "continue to payment" button on `paymentUrl` and `state.technicalName` instead.
- `paymentChangeable` is read from the `readOrder` response, not from the order itself. `loadOrderDetails` always sends `checkPromotion: true` — the flag the schema documents as *Check if the payment method of the order is still changeable* — so send the same flag when you build that request yourself.
- `activeTransaction` resolves at all only because `loadOrderDetails` puts `useDefaultOrderAssociations` into the criteria, which requests `transactions.paymentMethod` and `transactions.stateMachineState`. Associations you pass to `useOrderDetails` are deep-merged into that set rather than replacing it — `defu` recurses into the default objects, so nothing you add is dropped and no default is lost.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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
type StateMachineState = Schemas["StateMachineState"];
type Order = Schemas["Order"];
```

`HandlePaymentResponse` is `{ redirectUrl: string }`. Reading that type is the fastest way to see why the return page cannot skip reloading the order.

## Minimal Vue Example

<CodeExample title="Minimal order payment page">

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const orderId = useRoute().params.id as string;

const { order, loadOrderDetails, paymentChangeable, getPaymentMethods } =
  useOrderDetails(orderId);
const { state, paymentMethod, paymentUrl, handlePayment, changePaymentMethod } =
  useOrderPayment(order);

const availablePaymentMethods = ref<Schemas["PaymentMethod"][]>([]);
const isChangingPaymentMethod = ref(false);
const isLoaded = ref(false);
const loadError = ref("");
const paymentError = ref("");

const isPaid = computed(() => state.value?.technicalName === "paid");
const isPaymentOpen = computed(() => state.value?.technicalName === "open");

const hasValidPaymentUrl = computed(() => {
  if (typeof paymentUrl.value !== "string") return false;

  try {
    return new URL(paymentUrl.value).protocol === "https:";
  } catch {
    return false;
  }
});

const loadOrder = async () => {
  loadError.value = "";

  try {
    await loadOrderDetails();
  } catch {
    loadError.value =
      "We could not load your order. If you have just paid, do not pay again — check your order history.";
  } finally {
    isLoaded.value = true;
  }
};

onMounted(async () => {
  await loadOrder();
  if (!order.value) return;

  if (isPaymentOpen.value && !paymentUrl.value) {
    const origin = window.location.origin;
    try {
      await handlePayment(
        `${origin}/checkout/success/${orderId}/paid`,
        `${origin}/checkout/success/${orderId}/unpaid`
      );
    } catch {
      paymentError.value = "The payment could not be started.";
    }
  }

  if (paymentChangeable.value) {
    try {
      availablePaymentMethods.value = await getPaymentMethods();
    } catch {
      paymentError.value = "We could not load the other payment methods.";
    }
  }
});

const changeMethod = async (paymentMethodId: string) => {
  if (isChangingPaymentMethod.value) return;
  if (paymentMethodId === paymentMethod.value?.id) return;

  paymentError.value = "";
  isChangingPaymentMethod.value = true;

  try {
    await changePaymentMethod(paymentMethodId);
  } catch {
    paymentError.value = "The payment method could not be changed.";
    isChangingPaymentMethod.value = false;
    return;
  }

  try {
    await loadOrderDetails();
  } catch {
    paymentError.value =
      "Your payment method was changed, but this page could not be refreshed. Reload before paying.";
  } finally {
    isChangingPaymentMethod.value = false;
  }
};
</script>

<template>
  <section>
    <h1>Payment</h1>

    <p v-if="!isLoaded" aria-live="polite">Loading your order…</p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadOrder">Try again</button>
    </div>

    <p v-else-if="!order" role="alert">
      We could not find this order. Sign in again, or open it from your order
      confirmation link.
    </p>

    <div v-else>
      <p>Order {{ order.orderNumber }}</p>

      <p v-if="paymentError" role="alert">{{ paymentError }}</p>

      <dl aria-live="polite">
        <dt>Payment method</dt>
        <dd>{{ paymentMethod?.name ?? "Not available" }}</dd>
        <dt>Payment state</dt>
        <dd>{{ state?.translated.name ?? "Unknown" }}</dd>
      </dl>

      <p v-if="isPaid">Your payment was received.</p>

      <div v-else-if="isPaymentOpen">
        <p>Your payment is still open.</p>
        <a v-if="hasValidPaymentUrl" :href="paymentUrl" rel="noopener">
          Continue to the payment provider
        </a>
      </div>

      <p v-else>
        We cannot confirm the payment for this order yet. Contact us before
        paying again.
      </p>

      <fieldset v-if="paymentChangeable && !isPaid">
        <legend>Pay with a different method</legend>
        <button
          v-for="method in availablePaymentMethods"
          :key="method.id"
          type="button"
          :aria-disabled="isChangingPaymentMethod"
          :aria-busy="isChangingPaymentMethod"
          :aria-current="method.id === paymentMethod?.id ? 'true' : undefined"
          @click="changeMethod(method.id)"
        >
          {{ method.name }}
        </button>
      </fieldset>
    </div>
  </section>
</template>
```

</CodeExample>

The example hands the redirect to the customer through a link, and points `finishUrl` and `errorUrl` at child routes so the return does not re-enter this page. The starter template does both instead: it renders a button *and* watches `paymentUrl` with a five-second debounce that navigates on its own, so a customer reading the confirmation is pulled to the provider mid-read. Pick one, and if you keep the automatic navigation, announce it.

## State And Session

The order is not part of the sales channel context, but reading it still depends on the `sw-context-token`: `readOrder post /order` returns the orders of the customer that the token resolves to. A return page therefore has to run in the same session.

A guest whose session did not survive the provider needs the deep link flow instead — `readOrder post /order` accepts a `deepLinkCode` `filter` together with `email` and `zipcode`. `useOrderDetails` takes only an order id and extra associations, so it cannot send those fields. In that case build the call yourself and hand the resulting order to `useOrderPayment` as a `computed`. The body is required, and it still needs the associations and the `checkPromotion` flag:

```ts
const response = await apiClient.invoke("readOrder post /order", {
  body: {
    filter: [{ type: "equals", field: "deepLinkCode", value: deepLinkCode }],
    email,
    zipcode,
    associations: useDefaultOrderAssociations(),
    checkPromotion: true,
  },
});
```

Treat `deepLinkCode` as a credential: together with `email` and `zipcode` it is the entire authentication for that order, and it returns the addresses, line items and transactions. Send it in the request body only — never in a URL, a log line or an analytics event, where a referrer header or a shared link leaks the order.

`useOrderDetails` keeps the loaded order in the `swOrderDetails` injection, so `useOrderPayment(order)` and the summary on the page read the same object. Nothing else travels with it: `paymentUrl` and `paymentChangeable` are plain per-instance refs, and the order id is closed over per call site. A child component that calls `useOrderDetails(orderId)` to read the shared order therefore sees `order` immediately but `paymentChangeable` as `false` until it runs its own `loadOrderDetails()` — so the method switcher silently never renders. The injection is also unkeyed, so a nested `useOrderDetails(otherId).loadOrderDetails()` overwrites the parent's order in place.

Nothing in the frontend advances the payment state. `stateMachineState.technicalName` moves from `open` to `paid` on the server, so after a return the only reliable action is to load the order again.

## Edge Cases

- `useOrderPayment().handlePayment()` before `await loadOrderDetails()` sends no request and resolves to `undefined`, so the payment silently never starts. `useOrderDetails().handlePayment()` has no such guard — it closes over the order id and fires regardless.
- When the order's payment method has been deactivated in the admin, `activeTransaction` finds nothing, and `state`, `paymentMethod` and `isAsynchronous` are all `undefined`. A page that only branches on `paid` and `open` then renders neither branch — handle the empty state explicitly.
- Loading the order with your own `readOrder post /order` call and no associations leaves `transactions.paymentMethod` unresolved, so `activeTransaction` is `undefined` no matter what the payment did.
- `paymentChangeable` defaults to `false`, so a page that renders the method switcher before the order has loaded shows nothing.
- `finishUrl` and `errorUrl` are optional in the schema, and omitting them leaves the return target to the payment handler. Pass absolute URLs built from `window.location.origin` — they are used after the browser has left your application.
- `redirectUrl` is declared required and non-nullable in the generated response, so the types promise a `string` the schema cannot always deliver — a synchronous method has nowhere to send the customer. Guard the value before the browser sees it, and check the **scheme**, not just that it parses: `new URL()` resolves `javascript:` and `data:` without throwing. The starter template guards its watcher path this way, but its button path (`goToUrl`) assigns `window.location.href` with no check at all — do not copy that half.
- The declared type of `handlePayment` accepts a third `paymentDetails` argument, but neither implementation forwards it. The generated body declares only `orderId`, `finishUrl` and `errorUrl`, so a prepared payment flow that needs extra transaction fields has to add them through a schema override before `apiClient.invoke("handlePaymentMethod post /handle-payment")` will accept them.
- A customer can close the provider tab and come back later. Treat `open` as a resumable state rather than a failure.

## Common Mistakes

- Do not treat the redirect back to `finishUrl` as a successful payment. Load the order and read the state.
- Do not call `useOrderPayment().handlePayment()` before the order is loaded.
- Do not redirect to `paymentUrl` without checking its scheme — `new URL()` alone parses `javascript:` and `data:` too.
- Do not use relative paths for `finishUrl` and `errorUrl`.
- Do not render the payment button behind `isAsynchronous` alone.
- Do not mix `useOrderPayment().changePaymentMethod()` with the reload behaviour of `useOrderDetails().changePaymentMethod()` — only the latter refreshes the order.
- Do not change the payment method without checking `paymentChangeable`.
- Do not expose the raw provider or API error text. Map it to a message that tells the customer whether they were charged — and still report the original error to your logging channel, because withholding it from the customer is not a reason to lose it.
- Do not report a failed reload as a failed write. Give `changePaymentMethod` and the `loadOrderDetails` that follows it their own `catch`.
- Do not start the payment again on every mount. Guard on `paymentUrl`, and point `finishUrl` at a route other than the one that starts it.

## Testing Checklist

- The return page loads the order before any payment request is sent.
- `useOrderPayment().handlePayment()` with an unloaded order issues no request.
- A successful `handlePaymentMethod post /handle-payment` sets `paymentUrl` from `redirectUrl`.
- A `paymentUrl` whose scheme is not `https:` — including `javascript:` and `data:` — does not trigger a navigation.
- A failing order load renders an error with a retry, not the loading state.
- Mounting the page a second time with `paymentUrl` already set sends no new payment request.
- Returning with a `paid` state renders the success branch without a further payment request.
- Returning with an `open` state offers a way to resume the payment.
- An order whose transactions carry no active payment method renders an explicit empty state rather than nothing.
- `changePaymentMethod` calls `orderSetPayment post /order/payment` and the rendered method updates only after the order is reloaded.
- The method switcher is hidden while `paymentChangeable` is `false`.
- A failing payment request shows a UI-level error and leaves the order state untouched.

## Related Links

- [Payments documentation](../../guides/e-commerce/payments.html)
- [Checkout documentation](../../guides/e-commerce/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
