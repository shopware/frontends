---
nav:
  position: 20
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useCheckout
    - useSessionContext
    - useCart
  helpers: []
  operations:
    - readShippingMethod post /shipping-method
    - readPaymentMethod post /payment-method
    - readContext get /context
    - updateContext patch /context
    - createOrder post /checkout/order
    - checkoutGateway get /checkout/gateway
  schemas:
    - ShippingMethod
    - PaymentMethod
    - Order
    - CustomerAddress
    - SalesChannelContext
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "UI",
    action: "Open the checkout",
    detail:
      "The page refreshes the session context and the cart first, then loads the two method lists in parallel. A virtual cart skips the shipping request — which only works once the cart is actually loaded.",
    code: "await Promise.all([refreshSessionContext(), refreshCart()])",
    state: "swSessionContext, swCart",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "Store API",
    action: "Ask what is available",
    detail:
      "Both list requests are filtered searches restricted to available methods. Availability is computed from the current cart, addresses and rules, not from a static configuration.",
    code: 'apiClient.invoke("readShippingMethod post /shipping-method", { query: { onlyAvailable: true } })',
    state: "sw-context-token",
    typeKeys: [
      'operations["readShippingMethod post /shipping-method"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Cache in an injection",
    detail:
      "useCheckout stores the lists in the swShippingMethods and swPaymentMethods injections and returns early on the next call unless forceReload is passed.",
    code: "getShippingMethods({ forceReload: true })",
    state: "swShippingMethods, swPaymentMethods",
    typeKeys: ['Schemas["ShippingMethod"]'],
  },
  {
    title: "Shared state",
    action: "Select a method",
    detail:
      "Selecting a method is a context patch, not checkout state. setShippingMethod and setPaymentMethod are sugar for the session context setters and refresh the context afterwards.",
    code: "await setShippingMethod({ id })",
    state: "swSessionContext",
    typeKeys: ['operations["updateContext patch /context"]["body"]'],
  },
  {
    title: "UI",
    action: "Reload the other list",
    detail:
      "A shipping choice can change which payment methods are available and the delivery costs. The page reloads the opposite list with forceReload and refreshes the cart after every selection.",
    code: "await Promise.allSettled([getPaymentMethods({ forceReload: true }), refreshCart()])",
    state: "swCart",
    typeKeys: ['operations["readPaymentMethod post /payment-method"]["response"]'],
  },
  {
    title: "Store API",
    action: "Place the order",
    detail:
      "POST /checkout/order turns the current cart into an order and deletes the cart on the server. The response is the order, so the id for the confirmation page comes from there.",
    code: "const order = await createOrder()",
    state: "swCart (deleted server-side)",
    typeKeys: ['operations["createOrder post /checkout/order"]["response"]'],
  },
  {
    title: "UI",
    action: "Leave and refresh",
    detail:
      "The page navigates to the confirmation route and refreshes the cart, because the local cart still holds the line items the server has already consumed.",
    code: "await push(`/checkout/success/${order.id}`); refreshCart()",
    state: "reactive UI",
    typeKeys: ['Schemas["Order"]'],
  },
];
</script>

# Checkout and Order Placement

## Goal

Build a checkout that lets the customer pick a shipping and a payment method and place an order. The important part is that availability is recalculated by the Store API on every change, that a method selection is a context patch rather than checkout state, and that `POST /checkout/order` deletes the cart.

## Shopware Flow

There is no checkout resource in the Store API. A checkout is the current cart plus the current sales channel context, and the only request that turns one into the other is `POST /checkout/order`. The single other endpoint the checkout step adds is `GET /checkout/gateway`, which lets an app influence what the checkout may offer — everything else on the page either reads what is available or patches the context. (The rest of the `/checkout` prefix belongs to the cart, and to B2B budgets.)

The consequence is that the two method lists are not static. `readShippingMethod post /shipping-method` and `readPaymentMethod post /payment-method` are filtered searches whose results depend on the cart contents, the active addresses and the rules that match them. Picking a shipping method can remove a payment method, and picking a payment method can change the delivery costs — which is why `useCheckout` caches both lists but gives you `forceReload` to break that cache.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Checkout flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The checkout page refreshes the session context and the cart, then loads the shipping and payment method lists.
2. Both lists come back restricted to methods that are available for the current cart and context.
3. `useCheckout` caches them in the `swShippingMethods` and `swPaymentMethods` injections.
4. Selecting a method calls `setShippingMethod` or `setPaymentMethod`, which patch the context and refresh it.
5. The page reloads the opposite method list with `forceReload: true` and refreshes the cart, because both can have changed.
6. `createOrder()` sends `POST /checkout/order` and returns the created order.
7. The UI navigates to the confirmation route using `order.id`, refreshes the cart the server has already discarded, and reads the selected methods and the totals from composables instead of keeping its own copy.

You do not need to send the selected methods or the addresses in the order body. The Store API reads them from the context, so `createOrder()` accepts only `customerComment`, `affiliateCode` and `campaignCode`.

## Request Flow

| Step                     | Code                                                        | Store API               | Type                                                                                                |
| ------------------------ | ----------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| Refresh the context      | `refreshSessionContext()`                                   | `GET /context`          | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />                 |
| Load shipping methods    | `getShippingMethods()`                                      | `POST /shipping-method` | <SchemaTypeTooltip type-key='operations["readShippingMethod post /shipping-method"]["response"]' /> |
| Load payment methods     | `getPaymentMethods()`                                       | `POST /payment-method`  | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />   |
| Select a shipping method | `setShippingMethod({ id })`                                 | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />                 |
| Select a payment method  | `setPaymentMethod({ id })`                                  | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />                 |
| Place the order          | `createOrder({ customerComment })`                          | `POST /checkout/order`  | <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["body"]' />             |
| Run a checkout gateway   | `apiClient.invoke("checkoutGateway get /checkout/gateway")` | `GET /checkout/gateway` | <SchemaTypeTooltip type-key='operations["checkoutGateway get /checkout/gateway"]["response"]' />    |

`createOrder()` resolves to the created order itself, so the `order.id` you need for the confirmation route comes straight out of that response — there is no second request to read it back.

The two selection rows go to `PATCH /context` because `setShippingMethod` and `setPaymentMethod` on `useCheckout` are the `useSessionContext` setters re-exported. Each of them patches one field — `shippingMethodId` or `paymentMethodId` — and then re-reads the context.

`checkoutGateway get /checkout/gateway` has no composable wrapper. It returns **both** method lists plus an `errors` array whose entries carry a `blocking` flag, which is how an app withdraws a method or stops the checkout server-side. If your project runs such an app, the gateway response — not the two list endpoints — is the authoritative view of what the customer may choose.

## Composables

Pick by what owns the value, because the checkout page itself owns almost nothing:

| Composable          | Scope                              | Reach for it when                                                                                            |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `useSessionContext` | the whole sales channel context    | patching the selected methods or the active addresses, and calling `refreshSessionContext()` on entry        |
| `useCart`           | the cart behind that context       | reading `cartItems`, `totalPrice`, `isEmpty` and `isVirtualCart`, and calling `refreshCart()` after a change |
| `useCheckout`       | the two method lists and the order | listing what is available and placing the order                                                              |

`useCheckout` is the one this recipe is about:

- **Read** — `shippingMethods`, `paymentMethods`, `shippingAddress`, `billingAddress`.
- **Write** — `getShippingMethods`, `getPaymentMethods`, `createOrder`.
- **Re-exported from `useSessionContext`** — `selectedShippingMethod`, `setShippingMethod`, `selectedPaymentMethod`, `setPaymentMethod`. They read and patch the context; nothing about them is checkout-local. Same functions, but not the same declared types: `UseCheckoutReturn` narrows `setShippingMethod` to `{ id: string }` while `UseSessionContextReturn` widens it to `Partial<Schemas["ShippingMethod"]>`, so only the `useCheckout` signature rejects a call without an `id`. `setPaymentMethod` declares `{ id: string }` on both.

Four things the generated reference will not tell you:

- The list cache is **not** application-wide. `useCheckout` keeps it in the `swShippingMethods` and `swPaymentMethods` injections using plain `provide`/`inject` with a fresh `ref()` as the inject default, so it is shared down the provide tree only. Two sibling components each get their own list and each fire their own request. `useCart` is wrapped in `createSharedComposable`, so on the client there is one instance per app; on the server that wrapper is a no-op and `useCart` falls back to the same provide-tree sharing through `injectLocal`, which is why the starter calls it once in `app.vue`.
- `getShippingMethods()` and `getPaymentMethods()` return the cached list as soon as it is non-empty, so a plain second call is a no-op. `{ forceReload: true }` is the only way to refetch.
- `getShippingMethods` merges a `prices` association into the criteria and sorts the result by `position`. Its implementation takes a second `associations` argument, but `UseCheckoutReturn` does not declare it, so TypeScript rejects the call. The merge is `defu(builtIn, yours)`, and defu deep-merges objects rather than replacing them — the built-in contributes only an empty `prices: {}`, so it guarantees the association is requested without overriding anything you would pass.
- `shippingAddress` and `activeShippingAddress` are different computeds. `useCheckout().shippingAddress` is `shippingLocation.address` and nothing else, while `useSessionContext().activeShippingAddress` prefers `customer.activeShippingAddress` and only falls back to `shippingLocation.address`. Read the one whose fallback you want, rather than assuming they are interchangeable.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the order body, the method lists, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readShippingMethod post /shipping-method"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />
  <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["ShippingMethod"]' />
  <SchemaTypeTooltip type-key='Schemas["PaymentMethod"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
  <SchemaTypeTooltip type-key='Schemas["CustomerAddress"]' />
  <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type SalesChannelContext = operations["readContext get /context"]["response"];
type CreateOrderBody = operations["createOrder post /checkout/order"]["body"];
type OrderResponse = operations["createOrder post /checkout/order"]["response"];
type ShippingMethod = Schemas["ShippingMethod"];
type PaymentMethod = Schemas["PaymentMethod"];
type Order = Schemas["Order"];
type CustomerAddress = Schemas["CustomerAddress"];
```

`CreateOrderBody` is the shortest useful reminder of how little the order request carries. Everything else is context.

## Minimal Vue Example

<CodeExample title="Minimal checkout page">

```vue
<script setup lang="ts">
const {
  shippingMethods,
  paymentMethods,
  getShippingMethods,
  getPaymentMethods,
  selectedShippingMethod,
  setShippingMethod,
  selectedPaymentMethod,
  setPaymentMethod,
  createOrder,
  billingAddress,
} = useCheckout();
const { refreshSessionContext } = useSessionContext();
const { cart, cartItems, totalPrice, isEmpty, isVirtualCart, refreshCart } =
  useCart();

const isLoadingCheckout = ref(true);
const isSelectingMethod = ref(false);
const isPlacingOrder = ref(false);
const loadError = ref("");
const checkoutError = ref("");
const customerComment = ref("");
const placedOrderId = ref("");
const placedOrderNumber = ref("");
const heading = ref<HTMLElement | null>(null);

const shippingId = ref("");
const paymentId = ref("");
watch(selectedShippingMethod, (m) => (shippingId.value = m?.id ?? ""), {
  immediate: true,
});
watch(selectedPaymentMethod, (m) => (paymentId.value = m?.id ?? ""), {
  immediate: true,
});

const loadCheckout = async () => {
  loadError.value = "";
  isLoadingCheckout.value = true;

  try {
    await Promise.all([refreshSessionContext(), refreshCart()]);

    const results = await Promise.allSettled([
      ...(isVirtualCart.value
        ? []
        : [getShippingMethods({ forceReload: true })]),
      getPaymentMethods({ forceReload: true }),
    ]);
    if (results.some((result) => result.status === "rejected")) {
      checkoutError.value =
        "Some delivery or payment options could not be loaded.";
    }
  } catch (error) {
    console.error(error);
    loadError.value = "The checkout could not be loaded.";
  } finally {
    isLoadingCheckout.value = false;
  }
};

onMounted(loadCheckout);

const selectMethod = async (
  patch: () => Promise<void>,
  reloadOtherList: () => Promise<unknown>,
  failure: string,
) => {
  if (isSelectingMethod.value) return;
  checkoutError.value = "";
  isSelectingMethod.value = true;

  try {
    await patch();

    const results = await Promise.allSettled([
      reloadOtherList(),
      refreshCart(),
    ]);
    if (results.some((result) => result.status === "rejected")) {
      checkoutError.value =
        "Your selection was saved, but the totals could not be updated. Please reload before ordering.";
    }
  } catch (error) {
    console.error(error);
    checkoutError.value = failure;
  } finally {
    shippingId.value = selectedShippingMethod.value?.id ?? "";
    paymentId.value = selectedPaymentMethod.value?.id ?? "";
    isSelectingMethod.value = false;
  }
};

const chooseShippingMethod = (id: string) =>
  selectMethod(
    () => setShippingMethod({ id }),
    () => getPaymentMethods({ forceReload: true }),
    "The shipping method could not be selected.",
  );

const choosePaymentMethod = (id: string) =>
  selectMethod(
    () => setPaymentMethod({ id }),
    () =>
      isVirtualCart.value
        ? Promise.resolve()
        : getShippingMethods({ forceReload: true }),
    "The payment method could not be selected.",
  );

const placeOrder = async () => {
  if (isPlacingOrder.value || !selectedPaymentMethod.value) return;
  checkoutError.value = "";
  isPlacingOrder.value = true;

  try {
    const order = await createOrder({ customerComment: customerComment.value });
    placedOrderId.value = order.id;
    placedOrderNumber.value = order.orderNumber ?? "";
    await nextTick();
    heading.value?.focus();
  } catch (error) {
    console.error(error);
    checkoutError.value = "The order could not be placed. Please try again.";
  } finally {
    isPlacingOrder.value = false;
    try {
      await refreshCart();
    } catch (error) {
      console.error(error);
      checkoutError.value = "Reload the page to refresh your cart display.";
    }
  }
};
</script>

<template>
  <section>
    <h1 ref="heading" tabindex="-1">
      {{ placedOrderId ? "Thank you for your order" : "Checkout" }}
    </h1>

    <p v-if="checkoutError" role="alert">{{ checkoutError }}</p>

    <p v-if="placedOrderId" role="status">
      Your order number is {{ placedOrderNumber }}.
    </p>

    <p v-else-if="isLoadingCheckout" role="status">Loading the checkout…</p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadCheckout">Try again</button>
    </div>

    <p v-else-if="!cart">Your cart could not be read.</p>

    <p v-else-if="isEmpty">Your cart is empty.</p>

    <form v-else @submit.prevent="placeOrder">
      <fieldset v-if="!isVirtualCart" :aria-busy="isSelectingMethod">
        <legend>Shipping method</legend>
        <label v-for="method in shippingMethods" :key="method.id">
          <input
            v-model="shippingId"
            type="radio"
            name="shippingMethod"
            :value="method.id"
            :aria-disabled="isSelectingMethod"
            @change="chooseShippingMethod(method.id)"
          />
          {{ method.name }}
        </label>
      </fieldset>

      <fieldset :aria-busy="isSelectingMethod">
        <legend>Payment method</legend>
        <label v-for="method in paymentMethods" :key="method.id">
          <input
            v-model="paymentId"
            type="radio"
            name="paymentMethod"
            :value="method.id"
            :aria-disabled="isSelectingMethod"
            @change="choosePaymentMethod(method.id)"
          />
          {{ method.name }}
        </label>
      </fieldset>

      <p v-if="billingAddress">
        Billing to {{ billingAddress.street }}, {{ billingAddress.city }}
      </p>

      <label>
        Comment
        <textarea v-model="customerComment" />
      </label>

      <h2>Order summary</h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.label }}, quantity {{ item.quantity }}
        </li>
      </ul>

      <dl aria-live="polite">
        <dt>Total</dt>
        <dd>{{ totalPrice }}</dd>
      </dl>

      <p v-if="!selectedPaymentMethod" id="submit-hint">
        Select a payment method to continue.
      </p>

      <button
        type="submit"
        :aria-disabled="
          isPlacingOrder ||
          isSelectingMethod ||
          !selectedPaymentMethod ||
          (!isVirtualCart && !selectedShippingMethod)
        "
        :aria-describedby="!selectedPaymentMethod ? 'submit-hint' : undefined"
      >
        {{ isPlacingOrder ? "Placing the order…" : "Place the order" }}
      </button>
    </form>
  </section>
</template>
```

</CodeExample>

The example owns its initial load, so it works on its own. `vue-starter-template` also calls `refreshCart()` in `app.vue`, but that call is fire-and-forget inside `onMounted`, so keep the awaited one here: `isVirtualCart` is read on the very next line and is `false` until a cart has actually arrived.

The example shows the order number in place rather than navigating, so it stays self-contained. A real page does what the diagram shows and what `vue-starter-template` does: it pushes `order.id` into the `checkout/success/[id]` route and refreshes the cart afterwards. Note that the two identifiers are not interchangeable — `order.id` is the UUID the route needs, while `order.orderNumber` is the reference the customer sees on their confirmation mail.

`getShippingMethods` and `getPaymentMethods` are called with `forceReload: true` on mount as well. Without it, a checkout that a customer re-enters in the same session would render the lists that were available before they changed an address.

Four choices in the markup look unusual and are deliberate. The fieldsets and the submit button carry `aria-disabled` rather than `disabled`, because a disabled control cannot hold focus — a keyboard user selecting a method would be thrown back to the top of the document, so the handlers enforce the guard instead. The error paragraph is a `role="alert"`, because by the time it renders the control the customer used has been re-enabled and focus is nowhere near it. The total sits in an `aria-live="polite"` list, because choosing a shipping method changes the delivery costs without the customer touching the total. And the `h1` is focusable, because the form holding focus unmounts on success — without moving focus to the heading, a screen reader never learns the order went through.

**Keep this route out of the shared HTML cache.** Loading from `onMounted` is deliberate: it is what keeps the billing address and the line items out of the server-rendered response. `vue-starter-template` applies `isr` to `/**` and opts `/checkout` and `/checkout/**` out of it with `ssr: false`, so the page is safe there — but drop this example at another path, or refactor the load to `useAsyncData`/`callOnce`, and one customer's address is rendered into HTML that ISR then serves to everyone else. Personalized data does not belong in an ISR-cached response.

## State And Session

Nothing on this page is checkout-local. The selected methods and the active addresses live in the sales channel context behind the `sw-context-token`, and the summary lives in the shared cart. That is why the example refreshes the context on mount instead of trusting whatever the previous page left behind.

The two method lists are the exception: they are cached in the `swShippingMethods` and `swPaymentMethods` injections that `useCheckout` provides, and `getShippingMethods()` / `getPaymentMethods()` return the cached value immediately when it is non-empty. Because those injections are per provide tree rather than application-wide, a component that is not a descendant of the one that loaded them will fetch its own copy — plan the checkout as one tree, or accept the extra request.

After `createOrder()` resolves, the server has deleted the cart but the shared `swCart` value still holds the old line items. The example refreshes the cart in `finally`, so it also recovers when the order request failed and the cart is still alive. Do not swallow a failure from that refresh: `useCart` is shared app-wide, so a mini cart in the header would keep offering line items the customer has already paid for. The example flags it instead and asks for a reload.

## Edge Cases

- `readShippingMethod post /shipping-method` receives `onlyAvailable` as a **query** parameter, while `readPaymentMethod post /payment-method` receives it in the **body**. Do not copy one shape onto the other when calling `apiClient.invoke` directly.
- A virtual cart — a non-empty cart whose every non-promotion line item carries the `is-download` state — needs no shipping method. Read `isVirtualCart` only after the cart has loaded: on a cold page it is `false` until then, so an early check sends the shipping request anyway and the skip never happens.
- Requesting shipping methods for a virtual cart can return an empty array and block the order button for a reason the customer cannot fix.
- `billingAddress` reads `customer.activeBillingAddress`, so it is `undefined` for an anonymous session that has been through neither registration nor the guest form.
- `Order.id` is required in the generated types but `Order.orderNumber` is optional, so a strict compiler will make you handle the empty case even though the platform populates it for a placed order.
- `isEmpty` is `count <= 0` over the cart's line items, which makes an unloaded cart indistinguishable from an empty one. Branch on the cart value itself before falling through to `isEmpty`, or a failed load tells a customer with a full basket that it is gone.
- Nothing in the composables carries a request deadline. Configure `apiClientConfig.timeout` and branch on `isTimeoutError`, or a request that never settles leaves the checkout on its loading state with no error and no way out.
- Changing the shipping address or the billing address invalidates both method lists and the delivery costs. Reload both lists and the cart, not just one.
- `POST /checkout/order` can fail after the customer has confirmed — a stock change or a rule that no longer matches. The cart still exists in that case, so refresh it rather than sending the customer to a confirmation page.
- The order body carries `customerComment`, `affiliateCode` and `campaignCode` only. A prepared payment flow adds transaction details whose field names come from the payment handler, not from this operation.
- The templates do not both implement this flow. `vue-starter-template` loads each list once and does not reload the opposite one after a selection; the reload-and-refresh pattern described here is implemented in `vue-demo-store`, which is deprecated and kept only as a reference. Read the starter for structure, this page for the flow.

## Common Mistakes

- Do not treat a local copy of the selected method as the source of truth. `selectedShippingMethod` and `selectedPaymentMethod` come from the context; if a radio group needs a plain id ref, seed it from them and write through `setShippingMethod` / `setPaymentMethod`.
- Do not call `getShippingMethods()` again after a selection and expect fresh data. Without `forceReload: true` you get the cached list.
- Do not reload only the list the customer just touched. Availability is mutual.
- Do not send addresses or method ids in the `createOrder` body. They are not on it.
- Do not navigate to the confirmation page before `createOrder()` resolves. The order id only exists in its response.
- Do not leave the stale cart in place after an order. Refresh it, or the mini cart keeps showing items that were consumed.
- Do not render the raw `detail` of an `ApiClientError` from the order request. Map it to a message the customer can act on.
- Do not bind a radio group with `:checked` alone. Vue skips the DOM write when the bound value has not changed, so a rejected patch leaves the option the customer clicked visually selected while the context still holds the previous one.
- Do not leave a `Promise.allSettled` result unread. It never rejects, so the surrounding `try`/`catch` cannot see the failure and the page renders an empty list as if it were a real answer.
- Do not write `catch {}` without binding the error. You cannot log it, you cannot map it, and a programming error reaches the customer disguised as a failed order.
- Do not show `order.id` as the order number. It is a UUID; `order.orderNumber` is the reference the customer can quote.

## Testing Checklist

- Entering the checkout refreshes the session context and the cart before the method lists are requested.
- A virtual cart issues no `readShippingMethod post /shipping-method` request and still allows an order.
- Selecting a shipping method patches the context and reloads the payment methods with `forceReload`.
- Selecting a payment method patches the context and reloads the shipping methods with `forceReload`, unless the cart is virtual.
- Changing the shipping address reloads both method lists and the cart.
- Placing an order calls `createOrder post /checkout/order` once and exposes `order.id` for the route and `order.orderNumber` for the customer.
- After a successful order the cart is refreshed and reports empty; a failing refresh surfaces a reload hint rather than passing silently.
- A failing method selection shows an error, snaps the radio group back to the method still held in the context, and re-enables the fieldsets.
- Both method lists failing to load shows an error rather than an empty fieldset.
- A failing initial load offers a retry and never claims the cart is empty.
- A failing order shows a UI-level error, keeps the cart, and leaves the customer on the checkout.
- The submit button stays inert while no payment method is selected, and says why.
- Placing an order moves focus to the confirmation heading, and the heading is announced.

## Related Links

- [Create a checkout](../../guides/e-commerce/checkout.html)
- [Payments](../../guides/e-commerce/payments.html)
- [Work with the cart](../../guides/e-commerce/cart.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
