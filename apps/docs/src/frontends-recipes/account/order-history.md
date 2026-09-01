---
nav:
  position: 30
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useCustomerOrders
    - useOrderDetails
    - useDefaultOrderAssociations
    - useUser
  helpers: []
  operations:
    - readOrder post /order
    - orderSetPayment post /order/payment
    - handlePaymentMethod post /handle-payment
    - cancelOrder post /order/state/cancel
    - readPaymentMethod post /payment-method
  schemas:
    - Order
    - OrderRouteResponse
    - OrderLineItem
    - StateMachineState
    - Criteria
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Open the order history",
    detail:
      "The page passes a criteria to useCustomerOrders. Everything it wants to render on a row has to be requested here, because the composable adds no associations of its own.",
    code: "loadOrders({ page, associations, sort })",
    state: "local page state",
    typeKeys: ['operations["readOrder post /order"]["body"]'],
  },
  {
    title: "Composable",
    action: "Force the limit and the exact count",
    detail:
      "useCustomerOrders spreads your parameters, then overwrites limit with its own limit ref and merges total-count-mode set to exact. The limit you pass in the criteria never reaches the Store API.",
    code: 'body: { ...params, limit, "total-count-mode": "exact" }',
    state: "limit ref",
    typeKeys: ['Schemas["Criteria"]'],
  },
  {
    title: "Store API",
    action: "Read one page of orders",
    detail:
      "readOrder resolves the customer from the context token. No customer id is part of the request. The response carries one page of orders plus a paymentChangeable map keyed by order id.",
    code: 'apiClient.invoke("readOrder post /order")',
    state: "sw-context-token",
    typeKeys: [
      'operations["readOrder post /order"]["response"]',
      'Schemas["OrderRouteResponse"]',
    ],
  },
  {
    title: "Composable state",
    action: "Keep elements, total, page",
    detail:
      "useCustomerOrders stores orders.elements, orders.total, and orders.page in its own refs. It reads nothing else from the response, so paymentChangeable is dropped on the list.",
    code: "orders + currentPage + totalPages",
    state: "one page of orders",
    typeKeys: ['Schemas["Order"]'],
  },
  {
    title: "UI",
    action: "Open one order",
    detail:
      "A row links to a detail route that calls useOrderDetails with the order id. The row data is not handed over; the detail view loads the order again.",
    code: "useOrderDetails(orderId).loadOrderDetails()",
    state: "provided swOrderDetails ref",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Read the full order",
    detail:
      "loadOrderDetails calls the same readOrder operation with ids set to one order, the associations from useDefaultOrderAssociations, and checkPromotion set to true.",
    code: 'body: { ids: [orderId], associations, checkPromotion: true }',
    state: "line items, deliveries, transactions",
    typeKeys: [
      'operations["readOrder post /order"]["body"]',
      'Schemas["OrderLineItem"]',
    ],
  },
  {
    title: "UI",
    action: "Render the order",
    detail:
      "The detail view reads order, status, total, paymentMethod, and paymentChangeable from useOrderDetails instead of keeping its own copy of the row it came from.",
    code: "order + status + total + paymentChangeable",
    state: "reactive UI",
    typeKeys: ['Schemas["StateMachineState"]'],
  },
];
</script>

# Order History

## Goal

Build a paginated order history for a logged-in customer and a detail view for a single order. The important part is that both screens call the same `readOrder post /order` operation, and that what an order contains depends entirely on the associations you request, not on the generated `Order` type.

## Shopware Flow

`readOrder post /order` is a criteria route secured with the access key and the context token. There is no customer id in the request: the Store API returns the orders of whoever the `sw-context-token` header resolves to.

`useCustomerOrders().loadOrders()` sends only your criteria plus `limit` from its own ref and `"total-count-mode": "exact"`. It adds no associations, so a list row has `orderNumber`, `orderDate`, and `amountTotal` but no state, line items, deliveries, or transactions until you ask for them.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Order history flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer opens the order history and the page calls `loadOrders` with a criteria.
2. `useCustomerOrders` overwrites the `limit` in that criteria with its own `limit` ref and sets `"total-count-mode": "exact"`.
3. The Store API returns one page of orders for the customer behind the context token, together with a `paymentChangeable` map.
4. The composable keeps `orders.elements`, `orders.total`, and `orders.page`, and exposes `orders`, `currentPage`, and `totalPages`.
5. The customer opens one order and the detail view calls `useOrderDetails(orderId).loadOrderDetails()`.
6. `loadOrderDetails` calls `readOrder post /order` again with `ids`, the default order associations, and `checkPromotion: true`.
7. The UI reads `order`, `status`, `total`, and `paymentChangeable` from composables instead of keeping its own copy.

You do not assemble the detail criteria yourself. `useOrderDetails` calls `useDefaultOrderAssociations()` and merges it with the associations you pass as its second argument, with the defaults taking precedence on conflicting keys.

## Request Flow

| Step                      | Code                                   | Store API                  | Type                                                                                              |
| ------------------------- | -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------- |
| Load a page of orders     | `loadOrders(criteria)`                 | `POST /order`              | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />                      |
| Change the page           | `changeCurrentPage(page)`              | `POST /order`              | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />                  |
| Load one order            | `loadOrderDetails()`                   | `POST /order`              | <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />                                    |
| List selectable payments  | `getPaymentMethods()`                  | `POST /payment-method`     | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' /> |
| Change the payment method | `changePaymentMethod(paymentMethodId)` | `POST /order/payment`      | <SchemaTypeTooltip type-key='operations["orderSetPayment post /order/payment"]["body"]' />        |
| Start the payment again   | `handlePayment(finishUrl, errorUrl)`   | `POST /handle-payment`     | <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["body"]' />   |
| Cancel the order          | `cancel()`                             | `POST /order/state/cancel` | <SchemaTypeTooltip type-key='operations["cancelOrder post /order/state/cancel"]["response"]' />   |

## Composables

- `useCustomerOrders`: the order list. Exposes `loadOrders`, `changeCurrentPage`, `orders`, `currentPage`, `totalPages`, and `limit`. `limit` is a writable ref, and `loadOrders` uses it instead of any `limit` in your criteria.
- `useOrderDetails`: one order, created with `useOrderDetails(orderId, associations?)`. Exposes `loadOrderDetails`, `order`, `status`, `statusTechnicalName`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress`, `personalDetails`, `shippingMethod`, `paymentMethod`, `paymentChangeable`, `getPaymentMethods`, `changePaymentMethod`, `handlePayment`, `paymentUrl`, `cancel`, `documents`, `hasDocuments`, `getMediaFile`, and `getDocumentFile`.
- `useDefaultOrderAssociations`: the criteria associations `useOrderDetails` sends. It returns `stateMachineState`, `lineItems` with `cover` and `downloads.media`, `addresses`, `deliveries` with `shippingMethod`, `shippingOrderAddress` and `stateMachineState`, and `transactions` with `paymentMethod` and `stateMachineState`. Override it in your project when every order view needs a different shape.
- `useUser`: provides `isLoggedIn`, which decides whether the context token resolves to a customer and the order routes can answer at all.

## Types

Use generated Store API types when you type the list criteria, the response, or the order you render:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderLineItem"]' />
  <SchemaTypeTooltip type-key='Schemas["StateMachineState"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type OrderListCriteria = operations["readOrder post /order"]["body"];
type OrderListResponse = operations["readOrder post /order"]["response"];
type Order = Schemas["Order"];
type OrderLineItem = Schemas["OrderLineItem"];
type OrderState = Schemas["StateMachineState"];
```

`OrderListCriteria` intersects `Schemas["NoneFieldsCriteria"]` with the guest-authentication fields `email`, `zipcode`, `login`, and a `filter` restricted to an `equals` filter on `deepLinkCode`.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { operations } from "#shopware";

const {
  orders,
  loadOrders,
  changeCurrentPage,
  currentPage,
  totalPages,
  limit,
} = useCustomerOrders();
const { isLoggedIn } = useUser();

// loadOrders replaces the limit in your criteria with this ref, so set it here.
limit.value = 10;

// The list carries no associations by default: without stateMachineState the
// rows have no order state, even though the generated type declares one.
const criteria: operations["readOrder post /order"]["body"] = {
  associations: {
    stateMachineState: {},
  },
  sort: [{ field: "createdAt", order: "DESC" }],
};

const isLoading = ref(true);
const ordersError = ref("");

const loadFirstPage = async () => {
  ordersError.value = "";
  isLoading.value = true;

  try {
    await loadOrders({ ...criteria, page: 1 });
  } catch {
    ordersError.value = "Your orders could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

// changeCurrentPage re-sends the criteria of the last loadOrders call with a
// new page, so the associations and the sorting above are kept.
const goToPage = async (page: number) => {
  ordersError.value = "";
  isLoading.value = true;

  try {
    await changeCurrentPage(page);
  } catch {
    ordersError.value = "Your orders could not be loaded.";
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

// Immediate watcher instead of onMounted: the orders belong to the customer
// behind the context token, so the list is reloaded when the session changes.
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      loadFirstPage();
    }
  },
  { immediate: true }
);
</script>

<template>
  <section>
    <h1>Order history</h1>

    <p v-if="!isLoggedIn">Sign in to see your orders.</p>

    <template v-else>
      <p v-if="isLoading">Loading orders...</p>
      <p v-else-if="ordersError">{{ ordersError }}</p>
      <p v-else-if="!orders.length">You have not placed an order yet.</p>

      <template v-else>
        <ul>
          <li v-for="order in orders" :key="order.id">
            <a :href="`/account/order/details/${order.id}`">
              {{ order.orderNumber }}
            </a>
            <span>{{ formatDate(order.orderDate) }}</span>
            <span>{{ order.amountTotal }}</span>
            <span v-if="order.stateMachineState">
              {{ order.stateMachineState.translated.name }}
            </span>
          </li>
        </ul>

        <p>Page {{ currentPage }} of {{ totalPages }}</p>

        <button
          v-if="currentPage > 1"
          type="button"
          @click="goToPage(currentPage - 1)"
        >
          Previous page
        </button>

        <button
          v-if="currentPage < totalPages"
          type="button"
          @click="goToPage(currentPage + 1)"
        >
          Next page
        </button>
      </template>
    </template>
  </section>
</template>
```

## State And Session

The Store API resolves the customer of `readOrder post /order`, `orderSetPayment post /order/payment`, and `cancelOrder post /order/state/cancel` from the `sw-context-token` header. Nothing in the request names the customer, so the order history changes with the session and not with a route parameter.

`handlePaymentMethod post /handle-payment` is the exception: it is secured with the access key alone and identifies the order by `orderId` in the body.

Neither `useCustomerOrders` nor `useOrderDetails` refreshes the session context or the cart. Unlike login, reading orders does not change the session, so `orders` simply keeps describing the customer that was authenticated when the request was sent.

The two composables hold state differently. `useCustomerOrders` creates its refs per call, so two components calling it have two independent lists. `useOrderDetails` injects and provides a single `swOrderDetails` ref, so a component tree below the first caller shares one order object.

Guest orders reach the same route with `email`, `zipcode`, and an `equals` filter on `deepLinkCode` in the body. With `login: true`, the response carries an `sw-context-token` header, and the API client adopts that token as its new default header when the response is not publicly cacheable. Neither order composable sends those fields, so a guest order page calls `apiClient.invoke("readOrder post /order")` directly.

## Edge Cases

- `loadOrders` builds its body as `{ ...parameters, limit: limit.value }`. A `limit` in your criteria is overwritten, so page sizes are changed through `limit.value` before the call.
- The list request sends no associations. `Schemas["Order"]` declares `stateMachineState` and `documents` as required, but they are associations and stay undefined at runtime until you request them.
- The same applies to `lineItems`, `deliveries`, and `transactions`. A list row cannot show the ordered products, the shipping method, or the payment state unless the criteria asks for those associations.
- `useCustomerOrders` reads only `data.orders` from the response and discards `paymentChangeable`. Sending `checkPromotion: true` on the list gains nothing through this composable; `paymentChangeable` is available on `useOrderDetails`, whose request always sets it.
- `totalPages` is computed as `orders.total` divided by the current `limit` ref. Writing `limit.value` after a load changes `totalPages` without reloading anything.
- The generated body type restricts `filter` to the `deepLinkCode` guest-authentication filter, so narrowing the order list by other fields is not covered by the generated types. Use `sort`, `page`, and `limit` instead.
- `useOrderDetails().handlePayment()` stores `redirectUrl` in `paymentUrl` and nothing else. No navigation happens until you watch `paymentUrl` and redirect.
- The type of `handlePayment` accepts a third `paymentDetails` argument, but the implementation sends only `orderId`, `finishUrl`, and `errorUrl`.
- `cancel()` and `changePaymentMethod()` call `loadOrderDetails()` again, so the detail view is up to date afterwards. The `orders` ref of `useCustomerOrders` is separate state and still shows the previous status.
- `useOrderDetails` shares one order through provide and inject. A nested component created with a different order id reads the ancestor's order until its own `loadOrderDetails()` resolves, and then replaces the ancestor's order as well.

## Common Mistakes

- Do not pass `limit` inside the `loadOrders` criteria. Set `limit.value` on the composable.
- Do not trust the generated `Order` type as a description of what the list returned. It describes the entity, not the associations you requested.
- Do not carry a list row into the detail view as a finished order. Call `loadOrderDetails()` so line items, deliveries, transactions, and `paymentChangeable` exist.
- Do not keep a local `currentPage` or a local copy of `orders` next to `useCustomerOrders`.
- Do not decide whether the payment can still be changed from list data. Read `paymentChangeable` from `useOrderDetails`.
- Do not call `handlePayment()` and assume the customer left the page. Watch `paymentUrl` and redirect explicitly.
- Do not expose raw API error details from the order routes, including the guest authentication error codes, in the UI.

## Testing Checklist

- Loading the order history calls `readOrder post /order` with `"total-count-mode": "exact"` and the current `limit`.
- Paging calls `changeCurrentPage` and re-sends the criteria of the previous call with the new `page`.
- A row shows the order state only when the criteria requested the `stateMachineState` association.
- Opening an order calls `readOrder post /order` with `ids` set to that order and `checkPromotion: true`, and fills `order`, `status`, and `paymentChangeable`.
- `getPaymentMethods()` calls `readPaymentMethod post /payment-method` with `onlyAvailable` set to true.
- `changePaymentMethod()` calls `orderSetPayment post /order/payment` and reloads the order details.
- `cancel()` calls `cancelOrder post /order/state/cancel` and reloads the order so `statusTechnicalName` reflects the cancelled state.
- `handlePayment()` calls `handlePaymentMethod post /handle-payment` and sets `paymentUrl` to the returned redirect URL.
- A failing request shows a list-level error instead of an empty order history.
- A session without a customer renders the signed-out state and sends no order request.

## Related Links

- [Login recipe](login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Payments documentation](../../getting-started/e-commerce/payments.html)
