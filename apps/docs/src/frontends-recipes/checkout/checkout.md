---
nav:
  position: 30
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
    - createOrder post /checkout/order
    - checkoutGateway get /checkout/gateway
  schemas:
    - ShippingMethod
    - PaymentMethod
    - Order
    - CustomerAddress
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Open the checkout",
    detail:
      "The page refreshes the session context first, then loads the two method lists in parallel. A virtual cart skips the shipping request entirely.",
    code: "await refreshSessionContext(); getShippingMethods(); getPaymentMethods()",
    state: "per-page loading flags",
    typeKeys: [],
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
    title: "Context",
    action: "Select a method",
    detail:
      "Selecting a method is a context patch, not checkout state. setShippingMethod and setPaymentMethod are sugar for the session context setters and refresh the context.",
    code: "await setShippingMethod({ id })",
    state: "swSessionContext",
    typeKeys: ['Schemas["PaymentMethod"]'],
  },
  {
    title: "UI",
    action: "Reload the other list",
    detail:
      "A shipping choice can change which payment methods are available and the delivery costs. The page reloads the opposite list and the cart after every selection.",
    code: "await Promise.allSettled([refreshPaymentMethod(), refreshCart()])",
    state: "swCart",
    typeKeys: ['Schemas["CustomerAddress"]'],
  },
  {
    title: "Store API",
    action: "Place the order",
    detail:
      "POST /checkout/order turns the current cart into an order and deletes the cart on the server. The response is the order, so the id for the confirmation page comes from there.",
    code: "const order = await createOrder()",
    state: "order id",
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

There is no checkout resource in the Store API. A checkout is the current cart plus the current sales channel context, and the only genuinely new request is `POST /checkout/order`. Everything before it either reads what is available or patches the context.

The consequence is that the two method lists are not static. `readShippingMethod post /shipping-method` and `readPaymentMethod post /payment-method` are filtered searches whose results depend on the cart contents, the active addresses and the rules that match them. Picking a shipping method can remove a payment method, and picking a payment method can change the delivery costs — which is why `useCheckout` caches both lists but gives you `forceReload` to break that cache.

<RecipeFlowDiagram label="Checkout flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The checkout page refreshes the session context, then loads the shipping and payment method lists.
2. Both lists come back restricted to methods that are available for the current cart and context.
3. `useCheckout` caches them in the `swShippingMethods` and `swPaymentMethods` injections.
4. Selecting a method calls `setShippingMethod` or `setPaymentMethod`, which patch the context and refresh it.
5. The page reloads the opposite method list with `forceReload: true` and refreshes the cart, because both can have changed.
6. `createOrder()` sends `POST /checkout/order` and returns the created order.
7. The UI navigates to the confirmation route using `order.id` and refreshes the cart, which the server has already discarded.

You do not need to send the selected methods or the addresses in the order body. The Store API reads them from the context, so `createOrder()` accepts only `customerComment`, `affiliateCode` and `campaignCode`.

## Request Flow

| Step                     | Code                                                        | Store API               | Type                                                                                                |
| ------------------------ | ----------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| Load shipping methods    | `getShippingMethods()`                                      | `POST /shipping-method` | <SchemaTypeTooltip type-key='operations["readShippingMethod post /shipping-method"]["response"]' /> |
| Load payment methods     | `getPaymentMethods()`                                       | `POST /payment-method`  | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />   |
| Select a shipping method | `setShippingMethod({ id })`                                 | `PATCH /context`        | <SchemaTypeTooltip type-key='Schemas["ShippingMethod"]' />                                          |
| Select a payment method  | `setPaymentMethod({ id })`                                  | `PATCH /context`        | <SchemaTypeTooltip type-key='Schemas["PaymentMethod"]' />                                           |
| Place the order          | `createOrder({ customerComment })`                          | `POST /checkout/order`  | <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["body"]' />             |
| Read the created order   | `order.id`                                                  | `POST /checkout/order`  | <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["response"]' />         |
| Run a checkout gateway   | `apiClient.invoke("checkoutGateway get /checkout/gateway")` | `GET /checkout/gateway` | <SchemaTypeTooltip type-key='operations["checkoutGateway get /checkout/gateway"]["response"]' />    |

The two selection rows go to `PATCH /context` because `setShippingMethod` and `setPaymentMethod` on `useCheckout` are the `useSessionContext` setters re-exported.

`checkoutGateway get /checkout/gateway` has no composable wrapper. It lets an app influence the checkout server-side, most visibly the set of available payment methods, so treat the method lists as authoritative only after it has run.

## Composables

- `useCheckout`: the checkout surface. Loads and caches `shippingMethods` and `paymentMethods` via `getShippingMethods` and `getPaymentMethods`, exposes the current `shippingAddress` and `billingAddress`, re-exports `selectedShippingMethod`, `setShippingMethod`, `selectedPaymentMethod` and `setPaymentMethod`, and places the order with `createOrder`.
- `useSessionContext`: the actual owner of the selected methods and the active addresses. Use `refreshSessionContext()` when entering the checkout so the page does not start from a stale context.
- `useCart`: supplies `cartItems`, `subtotal`, `totalPrice`, `shippingCosts` and `isVirtualCart` for the summary, and `refreshCart()` after a selection and after the order.

## Types

Use generated Store API types when you need to type the order body, the method lists, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readShippingMethod post /shipping-method"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />
  <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["createOrder post /checkout/order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["ShippingMethod"]' />
  <SchemaTypeTooltip type-key='Schemas["PaymentMethod"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CreateOrderBody = operations["createOrder post /checkout/order"]["body"];
type CreatedOrder = operations["createOrder post /checkout/order"]["response"];
type ShippingMethod = Schemas["ShippingMethod"];
type PaymentMethod = Schemas["PaymentMethod"];
type Order = Schemas["Order"];
type CustomerAddress = Schemas["CustomerAddress"];
```

`CreateOrderBody` is the shortest useful reminder of how little the order request carries. Everything else is context.

## Minimal Vue Example

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
const { cartItems, totalPrice, isEmpty, isVirtualCart, refreshCart } =
  useCart();

const isLoadingMethods = ref(true);
const isPlacingOrder = ref(false);
const checkoutError = ref("");
const customerComment = ref("");
const placedOrderId = ref("");

onMounted(async () => {
  await refreshSessionContext();
  await Promise.allSettled([
    isVirtualCart.value ? null : getShippingMethods(),
    getPaymentMethods(),
  ]);
  isLoadingMethods.value = false;
});

const chooseShippingMethod = async (id: string) => {
  await setShippingMethod({ id });
  await Promise.allSettled([
    getPaymentMethods({ forceReload: true }),
    refreshCart(),
  ]);
};

const choosePaymentMethod = async (id: string) => {
  await setPaymentMethod({ id });
  await Promise.allSettled([
    getShippingMethods({ forceReload: true }),
    refreshCart(),
  ]);
};

const placeOrder = async () => {
  checkoutError.value = "";
  isPlacingOrder.value = true;

  try {
    const order = await createOrder({ customerComment: customerComment.value });
    placedOrderId.value = order.id;
  } catch {
    checkoutError.value = "The order could not be placed. Please try again.";
  } finally {
    await refreshCart();
    isPlacingOrder.value = false;
  }
};
</script>

<template>
  <p v-if="placedOrderId">
    Thank you. Your order number is {{ placedOrderId }}.
  </p>

  <p v-else-if="isEmpty">Your cart is empty.</p>

  <form v-else @submit.prevent="placeOrder">
    <p v-if="checkoutError">{{ checkoutError }}</p>

    <fieldset v-if="!isVirtualCart">
      <legend>Shipping method</legend>
      <p v-if="isLoadingMethods">Loading shipping methods…</p>
      <label v-for="method in shippingMethods" :key="method.id">
        <input
          type="radio"
          name="shippingMethod"
          :value="method.id"
          :checked="selectedShippingMethod?.id === method.id"
          @change="chooseShippingMethod(method.id)"
        />
        {{ method.name }}
      </label>
    </fieldset>

    <fieldset>
      <legend>Payment method</legend>
      <p v-if="isLoadingMethods">Loading payment methods…</p>
      <label v-for="method in paymentMethods" :key="method.id">
        <input
          type="radio"
          name="paymentMethod"
          :value="method.id"
          :checked="selectedPaymentMethod?.id === method.id"
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

    <ul>
      <li v-for="item in cartItems" :key="item.id">
        {{ item.label }} × {{ item.quantity }}
      </li>
    </ul>
    <p>Total {{ totalPrice }}</p>

    <button
      type="submit"
      :disabled="
        isPlacingOrder ||
        !selectedPaymentMethod ||
        (!isVirtualCart && !selectedShippingMethod)
      "
    >
      {{ isPlacingOrder ? "Placing the order…" : "Place the order" }}
    </button>
  </form>
</template>
```

## State And Session

Nothing on this page is checkout-local. The selected methods and the active addresses live in the sales channel context behind the `sw-context-token`, and the summary lives in the shared cart. That is why the example refreshes the context on mount instead of trusting whatever the previous page left behind.

The two method lists are the exception: they are cached in the `swShippingMethods` and `swPaymentMethods` injections that `useCheckout` provides. `getShippingMethods()` and `getPaymentMethods()` return the cached list immediately when it is non-empty, so a second component mounting the checkout issues no request. `forceReload: true` is the only way to refetch.

After `createOrder()` resolves, the server has deleted the cart but the shared `swCart` value still holds the old line items. The example refreshes the cart in `finally`, so it also recovers when the order request failed and the cart is still alive.

## Edge Cases

- `getShippingMethods()` merges a `prices` association into the criteria and sorts the result by `position`. If you pass your own associations, they are merged with `defu`, not replaced.
- `readShippingMethod post /shipping-method` receives `onlyAvailable` as a **query** parameter, while `readPaymentMethod post /payment-method` receives it in the **body**. Do not copy one shape onto the other when calling `apiClient.invoke` directly.
- A virtual cart — every non-promotion line item has the `is-download` state — needs no shipping method. Requesting the list anyway can return an empty array and block the order button for a reason the customer cannot fix.
- `useCheckout().shippingAddress` reads `shippingLocation.address` from the context, while `useSessionContext().activeShippingAddress` prefers the customer's `activeShippingAddress` and falls back to the same value. For a logged-in customer with a custom shipping address the two differ.
- `billingAddress` reads `customer.activeBillingAddress` and is `undefined` for a guest who has not been through the address step.
- Changing the shipping address or the billing address invalidates both method lists and the delivery costs. Reload both lists and the cart, not just one.
- `POST /checkout/order` can fail after the customer has confirmed — a stock change or a rule that no longer matches. The cart still exists in that case, so refresh it rather than sending the customer to a confirmation page.
- The order body carries `customerComment`, `affiliateCode` and `campaignCode` only. A prepared payment flow adds transaction details whose field names come from the payment handler, not from this operation.

## Common Mistakes

- Do not put the selected shipping or payment method into local component state. Read `selectedShippingMethod` and `selectedPaymentMethod`.
- Do not call `getShippingMethods()` again after a selection and expect fresh data. Without `forceReload: true` you get the cached list.
- Do not reload only the list the customer just touched. Availability is mutual.
- Do not send addresses or method ids in the `createOrder` body. They are not on it.
- Do not navigate to the confirmation page before `createOrder()` resolves. The order id only exists in its response.
- Do not leave the stale cart in place after an order. Refresh it, or the mini cart keeps showing items that were consumed.
- Do not render the raw `detail` of an `ApiClientError` from the order request. Map it to a message the customer can act on.

## Testing Checklist

- Entering the checkout refreshes the session context before the method lists are requested.
- A virtual cart issues no `readShippingMethod post /shipping-method` request and still allows an order.
- Selecting a shipping method patches the context and reloads the payment methods with `forceReload`.
- Selecting a payment method patches the context and reloads the shipping methods with `forceReload`.
- Changing the shipping address reloads both method lists and the cart.
- Placing an order calls `createOrder post /checkout/order` once and exposes `order.id`.
- After a successful order the cart is refreshed and reports empty.
- A failing order shows a UI-level error, keeps the cart, and leaves the customer on the checkout.
- The submit button stays disabled while no payment method is selected.

## Related Links

- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Payments documentation](../../getting-started/e-commerce/payments.html)
- [Cart documentation](../../getting-started/e-commerce/cart.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
