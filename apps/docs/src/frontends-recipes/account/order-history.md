---
nav:
  position: 45
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
    - orderDownloadFile get /order/download/{orderId}/{downloadId}
    - download post /document/download/{documentId}/{deepLinkCode}
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
import CodeExample from "../../components/CodeExample.vue";

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
    typeKeys: ['Schemas["NoneFieldsCriteria"]'],
  },
  {
    title: "Store API",
    action: "Read one page of orders",
    detail:
      "readOrder resolves the customer from the context token. No customer id is part of the request. The response carries one page of orders. It also carries a paymentChangeable map keyed by order id, but only when the request sent checkPromotion, which useCustomerOrders does not add.",
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

`useCustomerOrders().loadOrders()` sends only your criteria plus `limit` from its own ref and `"total-count-mode": "exact"`. It adds no associations of its own, so anything a row renders beyond the order's own columns — the state, the line items, the deliveries, the transactions — has to be asked for in the criteria you pass.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Order history flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer opens the order history and the page calls `loadOrders` with a criteria.
2. `useCustomerOrders` overwrites the `limit` in that criteria with its own `limit` ref and sets `"total-count-mode": "exact"`.
3. The Store API returns one page of orders for the customer behind the context token. `useCustomerOrders` adds no `checkPromotion` of its own, so unless your criteria passes one no `paymentChangeable` map comes back.
4. The composable keeps `orders.elements`, `orders.total`, and `orders.page`, and exposes `orders`, `currentPage`, and `totalPages`.
5. The customer opens one order and the detail view calls `useOrderDetails(orderId).loadOrderDetails()`.
6. `loadOrderDetails` calls `readOrder post /order` again with `ids`, the default order associations, and `checkPromotion: true`.
7. The UI reads `order`, `status`, `total`, and `paymentChangeable` from composables instead of keeping its own copy.

You do not assemble the detail criteria yourself. `useOrderDetails` calls `useDefaultOrderAssociations()`, which asks for `stateMachineState`, `lineItems` with `cover` and `downloads.media`, `addresses`, `deliveries` with `shippingMethod`, `shippingOrderAddress` and `stateMachineState`, and `transactions` with `paymentMethod` and `stateMachineState`. The associations you pass as the second argument are merged underneath that, so the defaults win on conflicting keys.

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

Pick by scope — how much of the order history the composable is about:

| Composable                    | Scope                    | Reach for it when                                        |
| ----------------------------- | ------------------------ | -------------------------------------------------------- |
| `useUser`                     | the customer session     | deciding between the list and the signed-out state       |
| `useCustomerOrders`           | the paginated order list | building the history page itself                         |
| `useOrderDetails`             | one order                | building the detail view, or any component below it      |
| `useDefaultOrderAssociations` | the detail criteria      | every order view in your project needs a different shape |

`useCustomerOrders` carries the list page:

- **Load** — `loadOrders(criteria)`, `changeCurrentPage(page)`.
- **Read** — `orders`, `currentPage`, `totalPages`.
- **Configure** — `limit`, the writable ref that decides the page size.

`useOrderDetails` carries the detail view, one order at a time:

- **Load** — `loadOrderDetails()` fills every value below except `paymentUrl`, which only `handlePayment()` writes, and returns the raw `OrderRouteResponse`.
- **Read** — `order`, `status`, `statusTechnicalName`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress`, `personalDetails`, `shippingMethod`, `paymentMethod`.
- **Payment** — `paymentChangeable`, `getPaymentMethods`, `changePaymentMethod`, `handlePayment`, `paymentUrl`.
- **Cancel** — `cancel()`.
- **Documents** — `documents`, `hasDocuments`, `getDocumentFile`, `getMediaFile`.

Six things the generated reference will not tell you:

- `limit` on `useCustomerOrders` is a writable ref that starts at `15`, and `loadOrders` overwrites whatever `limit` your criteria carries with it. Page sizes are changed through `limit.value`, never through the criteria.
- `useOrderDetails(orderId, associations?)` does not let you replace the default criteria. The second argument is merged **under** `useDefaultOrderAssociations()`, so the defaults win on conflicting keys. To change the shape of every order view, override `useDefaultOrderAssociations` in your project instead.
- `paymentDetails` exists only in the declared type of `handlePayment`. The function itself takes just `finishUrl` and `errorUrl`, so a third argument type-checks and is then ignored — only `orderId`, `finishUrl`, and `errorUrl` reach the Store API.
- `handlePayment()` stores the returned `redirectUrl` in `paymentUrl` and does nothing else. No navigation happens until you watch `paymentUrl` and redirect yourself — and check its scheme first, because `new URL()` parses `javascript:` and `data:` without throwing. The [Payment recipe](../checkout/payment.html) owns that guard.
- The two composables hold state differently. `useCustomerOrders` creates its refs per call, so two components calling it keep two independent lists. `useOrderDetails` injects and provides one shared `swOrderDetails` ref, so everything below the first caller reads the same order object.
- `getMediaFile(downloadId)` returns a `Blob` from `orderDownloadFile get /order/download/{orderId}/{downloadId}`. `getDocumentFile(documentId, deepLinkCode)` returns `Blob | string` from `download post /document/download/{documentId}/{deepLinkCode}`. The union is the hand-written return type, which covers every `accept` variant of the operation, but `getDocumentFile` always sends `accept: "application/pdf"`, so at runtime you get the `Blob` arm — an HTML or XML document is not reachable through this composable. Narrow it anyway to satisfy TypeScript before you hand it to `URL.createObjectURL`. Both are about attachments, not about the order body. `documents` is the one field that arrives without being asked for: `useDefaultOrderAssociations()` never requests it, but the route returns it anyway — which is why `hasDocuments` gets away with reading `order.documents.length` unguarded, while `documents` itself still falls back to an empty array.

`useUser` contributes only `isLoggedIn`, and it is narrower than it sounds: it is false for a guest, because it requires an active, non-guest customer — the [Customer Profile recipe](profile.html) compares it with `isCustomerSession` and `isGuestSession`. It gates the _registered_ customer's history, not every session the order routes will answer for — see the guest flow under [State And Session](#state-and-session).

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

`OrderListCriteria` intersects `Schemas["NoneFieldsCriteria"]` with `checkPromotion` and the guest-authentication fields `email`, `zipcode`, `login`, plus a `filter` restricted to an `equals` filter on `deepLinkCode`.

## Minimal Vue Example

<CodeExample title="Minimal order history page">

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

// browserLocale is the visitor's locale (navigator.language, or accept-language
// during SSR), not the storefront's. usePrice formats in that locale too, but
// takes the currency from the session context. Both beat the host default,
// which differs between the server render and the browser.
const { browserLocale } = useShopwareContext();
const { getFormattedPrice } = usePrice();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

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

// Starts false: the immediate watcher below runs synchronously in setup and
// flips it before the first render, so a signed-out visitor is never "busy".
const isLoading = ref(false);
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
// The in-flight guard is what makes aria-disabled safe: the buttons stay
// mounted and focusable, so the click has to be rejected here instead.
const changePage = async (page: number) => {
  if (isLoading.value || page < 1) return;
  // totalPages is 0 until a load succeeds, so the upper bound only applies
  // once there is data — otherwise the retry button could never fire.
  if (totalPages.value && page > totalPages.value) return;

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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(browserLocale).format(new Date(value));

// One live region for the page position and the loading state, so a page
// change is announced instead of silently swapping the list underneath.
const statusMessage = computed(() => {
  if (isLoading.value) return "Loading orders…";
  if (!orders.value.length) return "";
  return `Page ${currentPage.value} of ${totalPages.value}`;
});

// Immediate watcher instead of onMounted: the orders belong to the customer
// behind the context token, so the list is reloaded when the session changes.
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      loadFirstPage();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section :aria-busy="isLoading">
    <h1>Order history</h1>

    <p v-if="!isLoggedIn">Sign in to see your orders.</p>

    <template v-else>
      <p role="status">{{ statusMessage }}</p>

      <!-- role="alert" and a retry, not a replacement for the list: the
           previous page is still in `orders` and still worth showing. -->
      <div v-if="ordersError" role="alert">
        <p>{{ ordersError }}</p>
        <button type="button" @click="changePage(currentPage)">
          Try again
        </button>
      </div>

      <p v-else-if="!isLoading && !orders.length">
        You have not placed an order yet.
      </p>

      <ul v-if="orders.length">
        <li v-for="order in orders" :key="order.id">
          <!-- NuxtLink, not <a href>: a plain anchor is a full document
               navigation, and formatLink keeps the active locale prefix. -->
          <NuxtLink :to="formatLink(`/account/order/details/${order.id}`)">
            Order {{ order.orderNumber }}
          </NuxtLink>
          <time :datetime="order.orderDate">
            {{ formatDate(order.orderDate) }}
          </time>
          <span>{{ getFormattedPrice(order.amountTotal) }}</span>
          <span v-if="order.stateMachineState">
            {{ order.stateMachineState.translated.name }}
          </span>
        </li>
      </ul>

      <!-- Always mounted and aria-disabled rather than removed or disabled:
           unmounting the control the customer just activated drops focus to
           the document body. changePage() guards the click. -->
      <nav aria-label="Order history pages">
        <button
          type="button"
          :aria-disabled="isLoading || currentPage <= 1"
          @click="changePage(currentPage - 1)"
        >
          Previous page
        </button>

        <button
          type="button"
          :aria-disabled="isLoading || currentPage >= totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next page
        </button>
      </nav>
    </template>
  </section>
</template>
```

</CodeExample>

`vue-starter-template` builds the same page without `useCustomerOrders`: `app/pages/account/order/index.vue` calls `apiClient.invoke("readOrder post /order")` through its own paginated-list component, passing `useDefaultOrderAssociations()` so the rows carry the same shape as the detail view. That is the trade the composable makes visible — `useCustomerOrders` owns the pagination refs for you, at the cost of the forced `limit` and the discarded `paymentChangeable`. Reach for the composable when you want that state managed, and for `invoke` when you already have a pagination primitive.

## State And Session

The Store API resolves the customer of `readOrder post /order`, `orderSetPayment post /order/payment`, and `cancelOrder post /order/state/cancel` from the `sw-context-token` header. Nothing in the request names the customer, so the order history changes with the session and not with a route parameter.

`handlePaymentMethod post /handle-payment` names its target explicitly instead: the order comes from `orderId` in the body, not from the session alone — the route still requires the context token. `readPaymentMethod post /payment-method` is secured with the access key alone, because payment methods are sales-channel data rather than customer data. Before relying on that for any other route, read the `security` block of the schema your backend ships rather than assuming it: the declared requirement of a route can change between Shopware releases, and `/handle-payment` is one route where it has.

Neither `useCustomerOrders` nor `useOrderDetails` refreshes the session context or the cart. Unlike login, reading orders does not change the session, so `orders` simply keeps describing the customer that was authenticated when the request was sent.

Guest orders reach the same route with `email`, `zipcode`, and an `equals` filter on `deepLinkCode` in the body. With `login: true`, the response carries an `sw-context-token` header, and the API client adopts that token as its new default header when the response is not publicly cacheable — the [Session Context recipe](../context/session-context.html) explains why a `Cache-Control: public` token is ignored. Neither composable adds those fields for you. `useOrderDetails` cannot send them at all, and `useCustomerOrders` would forward them only because `loadOrders` spreads the whole body — it keeps just `orders.elements`, `total` and `page` in list refs and exposes nothing else of the response. A guest order page therefore calls `apiClient.invoke("readOrder post /order")` directly.

That route answers a guest session `isLoggedIn` reports as signed out, so a guest page branches on the rejection rather than on session state. The three codes it has to tell apart are `CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND`, `CHECKOUT__GUEST_NOT_AUTHENTICATED`, which is the signal to show the email and postcode form, and `CHECKOUT__GUEST_WRONG_CREDENTIALS`. The [Guest Order Lookup recipe](../orders/guest-order-lookup.html) walks through that flow end to end.

## Edge Cases

- `Schemas["Order"]` declares `stateMachineState` as required, but it is an association: it is `undefined` at runtime until your criteria asks for it. The generated type describes the entity, not the response you received.
- `lineItems`, `deliveries`, and `transactions` are absent for the same reason, but the type does not mislead you about them: all three are declared optional, so the compiler already makes you handle `undefined`. That contrast is what makes `stateMachineState` the trap. A list row cannot show the ordered products, the shipping method, or the payment state unless the criteria asks for those associations.
- `useCustomerOrders` reads only `data.orders` from the response and discards `paymentChangeable`. Sending `checkPromotion: true` on the list gains nothing through this composable; `paymentChangeable` is available on `useOrderDetails`, whose request always sets it.
- `totalPages` is `orders.total` divided by the current `limit` ref and rounded up. Writing `limit.value` after a load changes `totalPages` without reloading anything, so the last page can point past the end of the data you hold.
- The generated body type restricts `filter` to the `deepLinkCode` guest-authentication filter, so narrowing the order list by other fields is not covered by the generated types. Use `sort` and `page` instead, and set the page size through `limit.value`.
- `cancel()` and `changePaymentMethod()` call `loadOrderDetails()` again, so the detail view is up to date afterwards. The `orders` ref of `useCustomerOrders` is separate state and still shows the previous status.
- Because `useOrderDetails` shares one order, a nested component created with a different order id reads the ancestor's order until its own `loadOrderDetails()` resolves, and then replaces the ancestor's order as well.

## Common Mistakes

- Do not pass `limit` inside the `loadOrders` criteria. Set `limit.value` on the composable.
- Do not trust the generated `Order` type as a description of what the list returned. It describes the entity, not the associations you requested.
- Do not carry a list row into the detail view as a finished order. Call `loadOrderDetails()` so line items, deliveries, transactions, and `paymentChangeable` exist.
- Do not keep a local `currentPage` or a local copy of `orders` next to `useCustomerOrders`.
- Do not decide whether the payment can still be changed from list data. Read `paymentChangeable` from `useOrderDetails`.
- Do not call `handlePayment()` and assume the customer left the page. Watch `paymentUrl` and redirect explicitly.
- Do not redirect to `paymentUrl` without checking its scheme — `new URL()` alone parses `javascript:` and `data:` too.
- Do not unmount or disable the pagination control the customer is operating. The browser blurs a removed or disabled element and focus falls to the document body — keep it mounted, use `aria-disabled`, and guard the handler.
- Do not replace the order list with the error. The page the customer was reading is still in `orders`, and swapping it out leaves them with no retry and no way back.
- Do not expose raw API error details from the order routes in the UI. Branch on the guest authentication codes and render your own message.

## Testing Checklist

- Loading the order history calls `readOrder post /order` with `"total-count-mode": "exact"` and the current `limit`.
- Paging calls `changeCurrentPage` and re-sends the criteria of the previous call with the new `page`.
- A row shows the order state only when the criteria requested the `stateMachineState` association.
- Opening an order calls `readOrder post /order` with `ids` set to that order and `checkPromotion: true`, and fills `order`, `status`, and `paymentChangeable`.
- `getPaymentMethods()` calls `readPaymentMethod post /payment-method` with `onlyAvailable` set to true.
- `changePaymentMethod()` calls `orderSetPayment post /order/payment` and reloads the order details.
- `cancel()` calls `cancelOrder post /order/state/cancel` and reloads the order so `statusTechnicalName` reflects the cancelled state.
- `handlePayment()` calls `handlePaymentMethod post /handle-payment` and sets `paymentUrl` to the returned redirect URL.
- A failing request shows a list-level error instead of an empty order history, keeps the previously loaded page on screen, and offers a retry.
- Starting a page change announces the loading state and leaves focus on the pagination control that triggered it.
- A `paymentUrl` whose scheme is not `https:` — including `javascript:` and `data:` — does not trigger a navigation.
- Order dates render in the visitor's browser locale (`browserLocale`) and totals in the session currency, not the host default.
- A session without a logged-in customer renders the signed-out state and sends no order request.
- A guest reaching an order by deep link is prompted for email and postcode on `CHECKOUT__GUEST_NOT_AUTHENTICATED` rather than shown the signed-out state.

## Related Links

- [Login recipe](login.html)
- [Customer Profile recipe](profile.html)
- [Checkout and Order Placement recipe](../checkout/checkout.html)
- [Payment recipe](../checkout/payment.html)
- [Guest Order Lookup recipe](../orders/guest-order-lookup.html)
- [Session Context recipe](../context/session-context.html)
- [Language and Currency Switch recipe](../context/language-and-currency.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Checkout documentation](../../guides/e-commerce/checkout.html)
- [Payments documentation](../../guides/e-commerce/payments.html)
