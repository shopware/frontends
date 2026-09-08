---
nav:
  position: 10
recipe:
  area: orders
  status: stable
  frameworks:
    - vue
  composables:
    - useOrderDetails
    - useDefaultOrderAssociations
  helpers: []
  operations:
    - readOrder post /order
    - cancelOrder post /order/state/cancel
    - download post /document/download/{documentId}/{deepLinkCode}
    - orderDownloadFile get /order/download/{orderId}/{downloadId}
  schemas:
    - Order
    - Criteria
    - OrderRouteResponse
    - OrderLineItem
    - Document
    - StateMachineState
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Open one order",
    detail:
      "The page receives an order id from the route and creates the composable with it. Nothing is requested yet — the id alone is the whole input.",
    code: "const { order, loadOrderDetails } = useOrderDetails(orderId)",
    state: "route param orderId",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Build the criteria",
    detail:
      "useDefaultOrderAssociations returns the association tree an order detail page needs. Extra associations passed to useOrderDetails are merged into it with defu, not swapped for it.",
    code: "defu(useDefaultOrderAssociations(), associations)",
    state: "criteria associations",
    typeKeys: ['Schemas["Criteria"]'],
  },
  {
    title: "Store API",
    action: "Search for one order",
    detail:
      "readOrder is a search, not a read-by-id. The order id goes into the ids array and the response is an EntitySearchResult, so the order has to be picked out of elements.",
    code: 'apiClient.invoke("readOrder post /order", { body: { ids: [orderId], associations, checkPromotion: true } })',
    state: "sw-context-token",
    typeKeys: ['operations["readOrder post /order"]["body"]'],
  },
  {
    title: "Composable",
    action: "Unwrap and split",
    detail:
      "The first element becomes the shared order. The separate paymentChangeable map is stored on its own, because it is not part of the order entity.",
    code: "_sharedOrder.value = data.orders?.elements?.[0]",
    state: "swOrderDetails, paymentChangeable",
    typeKeys: ['Schemas["OrderRouteResponse"]'],
  },
  {
    title: "UI",
    action: "Read derived values",
    detail:
      "status, total, subtotal, shippingCosts, addresses and personalDetails are computed over the shared order. Nothing on the page needs to walk the entity itself.",
    code: "status, total, billingAddress, personalDetails",
    state: "reactive UI",
    typeKeys: ['Schemas["Order"]'],
  },
  {
    title: "Store API",
    action: "Cancel or download",
    detail:
      "cancel() posts the order id and returns the new state, then reloads the order. Document and file downloads are separate binary operations that return a Blob.",
    code: "await cancel(); await getDocumentFile(documentId, deepLinkCode)",
    state: "StateMachineState, Blob",
    typeKeys: ['Schemas["StateMachineState"]'],
  },
];
</script>

# Order Details

## Goal

Build a page that shows one placed order — its state, line items, addresses, totals, documents and downloads — and lets the customer cancel it. The important part is that `POST /order` is a search whose result depends entirely on the associations you ask for, so a detail page is defined by its criteria rather than by its id.

## Shopware Flow

`readOrder post /order` is a filtered entity search. Passing `ids: [orderId]` narrows it to one order, but the response is still an `EntitySearchResult`, and the order has to be taken from `orders.elements[0]`.

What the operation does _not_ do is decide which nested data comes back. Without associations an order has no line items, no deliveries, no transactions and no addresses — it is a price and a state. `useDefaultOrderAssociations` exists precisely to supply the tree a detail page needs, and `useOrderDetails` merges anything extra into it instead of replacing it.

<RecipeFlowDiagram label="Order details flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The route hands an order id to `useOrderDetails(orderId)`.
2. The composable merges `useDefaultOrderAssociations()` with any associations you passed, using `defu`.
3. `readOrder post /order` is sent with `ids`, the merged `associations`, and `checkPromotion: true`.
4. `useOrderDetails` stores `orders.elements[0]` as the shared order and `paymentChangeable` separately.
5. The UI reads `status`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress` and `personalDetails` from computed properties.
6. `cancel()` and the two download methods act on that order: the cancellation reloads it, the downloads return a `Blob`.

You do not need to reload the order after `cancel()` or `changePaymentMethod()` — both call `loadOrderDetails()` themselves.

## Request Flow

| Step                    | Code                                        | Store API                                             | Type                                                                                                                    |
| ----------------------- | ------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Load one order          | `loadOrderDetails()`                        | `POST /order`                                         | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />                                            |
| Read the search result  | `order`                                     | `POST /order`                                         | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />                                        |
| Cancel the order        | `cancel()`                                  | `POST /order/state/cancel`                            | <SchemaTypeTooltip type-key='operations["cancelOrder post /order/state/cancel"]["body"]' />                             |
| Read the new state      | `status`, `statusTechnicalName`             | `POST /order/state/cancel`                            | <SchemaTypeTooltip type-key='operations["cancelOrder post /order/state/cancel"]["response"]' />                         |
| Download a document     | `getDocumentFile(documentId, deepLinkCode)` | `POST /document/download/{documentId}/{deepLinkCode}` | <SchemaTypeTooltip type-key='operations["download post /document/download/{documentId}/{deepLinkCode}"]["response"]' /> |
| Download a digital file | `getMediaFile(downloadId)`                  | `GET /order/download/{orderId}/{downloadId}`          | <SchemaTypeTooltip type-key='operations["orderDownloadFile get /order/download/{orderId}/{downloadId}"]["response"]' /> |

The two download rows pass an explicit `accept` header — `application/pdf` for a document, `application/octet-stream` for a media file — so the API client returns binary content instead of trying to parse JSON.

## Composables

- `useOrderDetails`: takes an order id and optional extra associations. Reads `order`, `status`, `statusTechnicalName`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress`, `personalDetails`, `shippingMethod`, `paymentMethod`, `documents`, `hasDocuments`, `paymentChangeable`. Acts with `loadOrderDetails`, `cancel`, `changePaymentMethod`, `handlePayment`, `getDocumentFile`, `getMediaFile`, `getPaymentMethods`.
- `useDefaultOrderAssociations`: returns the default association tree — `stateMachineState`, `lineItems` with `cover` and `downloads.media`, `addresses`, `deliveries` with `shippingMethod`, `shippingOrderAddress` and `stateMachineState`, and `transactions` with `paymentMethod` and `stateMachineState`. Override it in your project when every order page in your storefront needs a different tree.

## Types

Use generated Store API types when you need to type the order criteria, the search response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderLineItem"]' />
  <SchemaTypeTooltip type-key='Schemas["Document"]' />
  <SchemaTypeTooltip type-key='Schemas["StateMachineState"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
type OrderLineItem = Schemas["OrderLineItem"];
type OrderDocument = Schemas["Document"];
type OrderState = Schemas["StateMachineState"];
```

`ReadOrderBody` is where the criteria live. It is also the type that reveals the guest authentication fields — `filter`, `email`, `zipcode` and `login` — that a customer-session page never uses.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const orderId = useRoute().params.id as string;

const {
  order,
  status,
  statusTechnicalName,
  total,
  subtotal,
  shippingCosts,
  billingAddress,
  shippingAddress,
  personalDetails,
  shippingMethod,
  paymentMethod,
  documents,
  hasDocuments,
  loadOrderDetails,
  cancel,
  getDocumentFile,
} = useOrderDetails(orderId);

const isLoading = ref(true);
const isCancelling = ref(false);
const orderError = ref("");

const isCancellable = computed(
  () =>
    !!order.value &&
    !["cancelled", "completed"].includes(statusTechnicalName.value ?? "")
);

onMounted(async () => {
  try {
    await loadOrderDetails();
  } catch {
    orderError.value = "This order could not be loaded.";
  } finally {
    isLoading.value = false;
  }
});

const cancelOrder = async () => {
  orderError.value = "";
  isCancelling.value = true;

  try {
    await cancel();
  } catch {
    orderError.value = "The order could not be cancelled.";
  } finally {
    isCancelling.value = false;
  }
};

const openDocument = async (document: Schemas["Document"]) => {
  const file = await getDocumentFile(document.id, document.deepLinkCode);
  const url = URL.createObjectURL(
    new Blob([file], { type: "application/pdf" })
  );

  window.open(url, "_blank");
};
</script>

<template>
  <p v-if="isLoading">Loading your order…</p>

  <p v-else-if="orderError">{{ orderError }}</p>

  <p v-else-if="!order">This order does not exist.</p>

  <article v-else>
    <h1>Order {{ order.orderNumber }}</h1>
    <p>{{ status }}</p>
    <p>{{ personalDetails.firstName }} {{ personalDetails.lastName }}</p>

    <ul>
      <li v-for="item in order.lineItems" :key="item.id">
        {{ item.label }} × {{ item.quantity }} — {{ item.totalPrice }}
      </li>
    </ul>

    <dl>
      <dt>Subtotal</dt>
      <dd>{{ subtotal }}</dd>
      <dt>Shipping</dt>
      <dd>{{ shippingCosts }}</dd>
      <dt>Total</dt>
      <dd>{{ total }}</dd>
    </dl>

    <section v-if="shippingAddress">
      <h2>Delivery</h2>
      <p>{{ shippingAddress.street }}, {{ shippingAddress.city }}</p>
      <p>{{ shippingMethod?.name }}</p>
    </section>

    <section v-if="billingAddress">
      <h2>Billing</h2>
      <p>{{ billingAddress.street }}, {{ billingAddress.city }}</p>
      <p>{{ paymentMethod?.name }}</p>
    </section>

    <section v-if="hasDocuments">
      <h2>Documents</h2>
      <button
        v-for="document in documents"
        :key="document.id"
        type="button"
        @click="openDocument(document)"
      >
        {{ document.config.name }}
      </button>
    </section>

    <button
      v-if="isCancellable"
      type="button"
      :disabled="isCancelling"
      @click="cancelOrder()"
    >
      {{ isCancelling ? "Cancelling…" : "Cancel this order" }}
    </button>
  </article>
</template>
```

## State And Session

The order is resolved from the `sw-context-token`: `readOrder post /order` returns only orders that belong to the customer the token identifies. An order id alone grants nothing, which is why an unauthenticated visitor gets an empty `elements` array rather than an error.

`useOrderDetails` keeps the loaded order in the `swOrderDetails` injection. That is a single slot, not a cache keyed by id — every instance in the component tree points at the same order, so a page that renders two different orders at once will see them overwrite each other.

The order is a snapshot. Its line items, prices and addresses are `OrderLineItem` and `OrderAddress` entities copied at order time, not references to the current product or customer address. Nothing that changes in the catalogue or the account afterwards is reflected here.

## Edge Cases

- `orders.elements` is empty when the id is unknown _or_ when the order belongs to a different session. Distinguish "not found" from "not yours" in the UI at your own risk — the API does not.
- `shippingAddress` reads `deliveries[0].shippingOrderAddress`, so an order with no delivery — a purely digital order — has no shipping address at all.
- `billingAddress` is found by matching `billingAddressId` against the `addresses` association. Drop `addresses` from the associations and it becomes `undefined` even though the id is present.
- `paymentMethod` is the **last** transaction's method and `shippingMethod` the **last** delivery's. An order whose payment method was changed has more than one transaction, and the last one is the current one.
- `paymentChangeable` is only populated because `loadOrderDetails` sends `checkPromotion: true`. It is a map keyed by order id in the response, exposed as a boolean for this order, defaulting to `false`.
- `cancel()` cannot be reverted and returns the new `StateMachineState`. Whether it is allowed depends on the order state on the server, so a rejected call is a normal outcome, not a bug.
- `getDocumentFile` needs both the document id and its `deepLinkCode`. The code comes from the `documents` association on the order, so a page without that data cannot build a download link.
- `getMediaFile` only works for line items whose `downloads` association is present, which the default associations request through `lineItems.downloads.media`.
- `status` is the translated state name and `statusTechnicalName` the stable one. Branch on `statusTechnicalName`; show `status`.

## Common Mistakes

- Do not treat `readOrder post /order` as a read-by-id. It is a search, and the order lives in `orders.elements[0]`.
- Do not replace the default associations when you only need one more. Pass the extra tree and let `defu` merge it.
- Do not branch on the translated `status` string. It changes with the language.
- Do not call `loadOrderDetails()` again after `cancel()` or `changePaymentMethod()`.
- Do not mount two `useOrderDetails` instances for different orders in the same tree. They share one `swOrderDetails` slot.
- Do not resolve product data from an order line item against the current catalogue. The line item is a snapshot.
- Do not build a document URL by hand. `getDocumentFile` sets the `accept` header the operation needs.
- Do not show a cancel button for every state. Read `statusTechnicalName` first.

## Testing Checklist

- Opening the page sends exactly one `readOrder post /order` with the order id in `ids`.
- The request carries the default associations, and extra associations passed to the composable are merged rather than replacing them.
- An unknown order id renders an empty state instead of throwing.
- `status` shows the translated state and `statusTechnicalName` the technical one.
- Line items, addresses, shipping method and payment method render from the associations without a second request.
- `cancel()` calls `cancelOrder post /order/state/cancel` and then reloads the order, and the rendered state changes.
- A rejected cancellation shows a UI-level error and leaves the state unchanged.
- Downloading a document calls `download post /document/download/{documentId}/{deepLinkCode}` with the document's `deepLinkCode`.
- An order without deliveries renders without a shipping address block.

## Related Links

- [Login recipe](../account/login.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Payments documentation](../../getting-started/e-commerce/payments.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
