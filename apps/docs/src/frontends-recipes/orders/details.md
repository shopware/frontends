---
nav:
  position: 20
recipe:
  area: orders
  status: stable
  frameworks:
    - vue
  composables:
    - useOrderDetails
    - useDefaultOrderAssociations
    - useOrderPayment
  helpers:
    - downloadFile
  operations:
    - readOrder post /order
    - cancelOrder post /order/state/cancel
    - readPaymentMethod post /payment-method
    - orderSetPayment post /order/payment
    - handlePaymentMethod post /handle-payment
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
import CodeExample from "../../components/CodeExample.vue";

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
      "cancel() posts the order id, reloads the order and returns the new state. Document and file downloads are separate operations whose binary body is parsed from the response content type.",
    code: "await cancel(); await getDocumentFile(documentId, deepLinkCode)",
    state: "swOrderDetails (reloaded)",
    typeKeys: ['Schemas["StateMachineState"]'],
  },
];
</script>

# Order Details

## Goal

Build a page that shows one placed order — its state, line items, addresses, totals, documents and downloads — and lets the customer cancel it. The important part is that `POST /order` is a search whose result depends entirely on the associations you ask for, so a detail page is defined by its criteria rather than by its id.

This recipe is about the single order. The paginated list it is opened from is the [Order History recipe](../account/order-history.html), and reaching one order without a customer session is the [Guest Order Lookup recipe](guest-order-lookup.html).

## Shopware Flow

`readOrder post /order` is a filtered entity search. Passing `ids: [orderId]` narrows it to one order, but the response is still an `EntitySearchResult`, and the order has to be taken from `orders.elements[0]`.

What the operation does _not_ do is decide which nested data comes back. Without associations an order has no line items, no deliveries, no transactions and no addresses — it is a price and a set of ids. Even the state is an association: `status` reads `stateMachineState.translated.name`, which is why `stateMachineState` sits in the default tree next to the rest. `useDefaultOrderAssociations` exists precisely to supply the tree a detail page needs, and `useOrderDetails` merges anything extra into it instead of replacing it.

<RecipeFlowDiagram label="Order details flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The route hands an order id to `useOrderDetails(orderId)`.
2. The composable merges `useDefaultOrderAssociations()` with any associations you passed, using `defu`.
3. `readOrder post /order` is sent with `ids`, the merged `associations`, and `checkPromotion: true`.
4. `useOrderDetails` stores `orders.elements[0]` as the shared order and `paymentChangeable` separately.
5. The UI reads `status`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress` and `personalDetails` from computed properties.
6. `cancel()` and the two download methods act on that order: the cancellation reloads it, `getMediaFile` returns a `Blob`, and `getDocumentFile` returns `Blob | string` — the XML and HTML document variants come back as text.

You do not need to reload the order after `useOrderDetails`' `cancel()` or `changePaymentMethod()` — both call `loadOrderDetails()` themselves.

## Request Flow

| Step                      | Code                                        | Store API                                             | Type                                                                                                                    |
| ------------------------- | ------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Load one order            | `loadOrderDetails()`                        | `POST /order`                                         | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />                                            |
| Read the search result    | `order`                                     | `POST /order`                                         | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />                                        |
| Cancel the order          | `cancel()`                                  | `POST /order/state/cancel`                            | <SchemaTypeTooltip type-key='operations["cancelOrder post /order/state/cancel"]["body"]' />                             |
| Read the new state        | `await cancel()`                            | `POST /order/state/cancel`                            | <SchemaTypeTooltip type-key='operations["cancelOrder post /order/state/cancel"]["response"]' />                         |
| Download a document       | `getDocumentFile(documentId, deepLinkCode)` | `POST /document/download/{documentId}/{deepLinkCode}` | <SchemaTypeTooltip type-key='operations["download post /document/download/{documentId}/{deepLinkCode}"]["response"]' /> |
| Download a digital file   | `getMediaFile(downloadId)`                  | `GET /order/download/{orderId}/{downloadId}`          | <SchemaTypeTooltip type-key='operations["orderDownloadFile get /order/download/{orderId}/{downloadId}"]["response"]' /> |
| List selectable payments  | `getPaymentMethods()`                       | `POST /payment-method`                                | <SchemaTypeTooltip type-key='operations["readPaymentMethod post /payment-method"]["response"]' />                       |
| Change the payment method | `changePaymentMethod(paymentMethodId)`      | `POST /order/payment`                                 | <SchemaTypeTooltip type-key='operations["orderSetPayment post /order/payment"]["body"]' />                              |
| Start the payment         | `handlePayment(successUrl, errorUrl)`       | `POST /handle-payment`                                | <SchemaTypeTooltip type-key='operations["handlePaymentMethod post /handle-payment"]["body"]' />                         |

`changePaymentMethod()` and `cancel()` each send a second request of their own: both await `loadOrderDetails()` before they resolve, so the first row runs again without you asking for it. `cancel()` returns the new `StateMachineState`, but `status` and `statusTechnicalName` are not read from it — they are computed over the shared order and only change once the reload that `cancel()` triggers has finished.

The `accept` value on the two download rows — `application/pdf` for a document, `application/octet-stream` for a media file — is part of the generated operation type, not a header: the type requires it, and on the document route it also picks which response variant — PDF, HTML or XML — the call is typed as. The API client does not forward it: every request still goes out with the client's default `Accept: application/json`. The binary body arrives because the Store API answers with the file's own content type, and the fetch layer parses the response by that type. Only `headers` reaches the wire, and for these two operations the generated headers type declares nothing but `sw-language-id`, so there is no typed way to set `Accept` per request.

## Composables

- `useOrderDetails`: takes an order id and optional extra associations. Reads `order`, `status`, `statusTechnicalName`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress`, `personalDetails`, `shippingMethod`, `paymentMethod`, `documents`, `hasDocuments`, `paymentChangeable`, `paymentUrl`. Acts with `loadOrderDetails`, `cancel`, `changePaymentMethod`, `handlePayment`, `getDocumentFile`, `getMediaFile`, `getPaymentMethods`.
- `useDefaultOrderAssociations`: returns the default association tree — `stateMachineState`, `lineItems` with `cover` and `downloads.media`, `addresses`, `deliveries` with `shippingMethod`, `shippingOrderAddress` and `stateMachineState`, and `transactions` with `paymentMethod` and `stateMachineState`. Override it in your project when every order page in your storefront needs a different tree. Note that `documents` is not in the tree and does not need to be — the Store API returns it with the order.
- `useOrderPayment`: takes the `order` computed returned by `useOrderDetails` and drives the payment of an already placed order. Reads `activeTransaction`, `state`, `isAsynchronous`, `paymentMethod`, `paymentUrl`; acts with `handlePayment` and `changePaymentMethod`. This is what the starter template uses on the checkout success page, and it is the composable to reach for when a payment has to be retried or redirected. Its `paymentMethod` is the **first** transaction whose payment method is active, which is not necessarily the **last** one `useOrderDetails` reports.

Each composable owns its own `paymentUrl` ref — they are not provided or shared — and `handlePayment()` writes the redirect target into that ref rather than handing it back; `useOrderDetails`' version returns nothing at all. Watch the ref belonging to whichever composable's `handlePayment()` you called, and check the URL's scheme before following it — `new URL()` parses `javascript:` and `data:` without throwing. The [Payment recipe](../checkout/payment.html) owns that guard and the rest of the retry flow.

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

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/orders/details/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
type OrderLineItem = Schemas["OrderLineItem"];
type Document = Schemas["Document"];
type StateMachineState = Schemas["StateMachineState"];
```

<!-- /automd -->

`ReadOrderBody` is where the criteria live. It is also the type that reveals the guest authentication fields — `filter`, `email`, `zipcode` and `login` — which a customer-session page never touches and a guest order lookup is built on.

## Minimal Vue Example

<CodeExample title="Minimal order details page">

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/orders/details/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { downloadFile } from "@shopware/helpers";

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

const loadError = ref("");
const cancelError = ref("");
const documentError = ref("");

const canCancelOrder = computed(
  () =>
    !!order.value &&
    !["cancelled", "completed"].includes(statusTechnicalName.value ?? ""),
);

const messageFor = (error: unknown, fallback: string) =>
  error instanceof ApiClientError && error.status === 403
    ? "Your session has expired. Please sign in again."
    : fallback;

onMounted(async () => {
  try {
    await loadOrderDetails();
  } catch (error) {
    console.error(error);
    loadError.value = messageFor(error, "This order could not be loaded.");
  } finally {
    isLoading.value = false;
  }
});

const requestCancellation = async () => {
  if (isCancelling.value) return;

  cancelError.value = "";
  isCancelling.value = true;

  try {
    await cancel();
  } catch (error) {
    console.error(error);
    cancelError.value = messageFor(
      error,
      "We could not confirm the cancellation. Please reload this page before trying again.",
    );
  } finally {
    isCancelling.value = false;
  }
};

const downloadDocument = async (orderDocument: Schemas["Document"]) => {
  documentError.value = "";
  const fileType = orderDocument.fileType ?? "pdf";

  try {
    const file = await getDocumentFile(
      orderDocument.id,
      orderDocument.deepLinkCode,
    );

    // A PDF arrives as a Blob, the HTML and XML variants as text. Both are
    // valid documents, so wrap the text instead of treating it as a failure.
    const blob =
      typeof file === "string"
        ? new Blob([file], {
            type: fileType === "xml" ? "application/xml" : "text/html",
          })
        : file;

    if (!(blob instanceof Blob) || blob.size === 0) {
      documentError.value = "This document is no longer available.";
      return;
    }

    downloadFile(blob, `${orderDocument.config.name}.${fileType}`);
  } catch (error) {
    console.error(error);
    documentError.value = messageFor(
      error,
      "This document could not be downloaded.",
    );
  }
};
</script>

<template>
  <p v-if="isLoading" role="status">Loading your order…</p>

  <p v-else-if="loadError" role="alert">{{ loadError }}</p>

  <p v-else-if="!order">This order does not exist.</p>

  <article v-else>
    <h1>Order {{ order.orderNumber }}</h1>
    <p aria-live="polite">Status: {{ status }}</p>
    <p>
      Customer: {{ personalDetails.firstName }} {{ personalDetails.lastName }}
    </p>

    <h2>Items</h2>
    <ul>
      <li v-for="item in order.lineItems" :key="item.id">
        {{ item.label }}
        <span class="sr-only">Quantity:</span> × {{ item.quantity }}
        <span class="sr-only">Total:</span> — {{ item.totalPrice }}
      </li>
    </ul>

    <h2>Summary</h2>
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

      <p v-if="documentError" role="alert">{{ documentError }}</p>

      <button
        v-for="orderDocument in documents"
        :key="orderDocument.id"
        type="button"
        :aria-label="`Download ${orderDocument.config.name} (${orderDocument.fileType ?? 'pdf'})`"
        @click="downloadDocument(orderDocument)"
      >
        {{ orderDocument.config.name }}
      </button>
    </section>

    <p v-if="cancelError" role="alert">{{ cancelError }}</p>

    <button
      v-if="canCancelOrder"
      type="button"
      :aria-disabled="isCancelling"
      :aria-busy="isCancelling"
      @click="requestCancellation()"
    >
      {{ isCancelling ? "Cancelling…" : "Cancel this order" }}
    </button>
  </article>
</template>
```

<!-- /automd -->

</CodeExample>

Three choices in the markup are deliberate. The cancel button carries `aria-disabled` rather than `disabled`, because a disabled control cannot hold focus — a keyboard user who just pressed it would be thrown back to the top of the document; `aria-disabled` does not stop activation, so the `if (isCancelling.value) return` guard at the top of the handler is what actually prevents a second request. The error paragraphs are `role="alert"` and sit beside the control they belong to rather than in the `v-if` chain, because a failed cancellation or download leaves the order itself perfectly valid — replacing the whole page with the message would destroy what the customer came to read. And the status paragraph is `aria-live="polite"`, because `cancel()` reloads the order and changes that text without the customer touching it.

`.sr-only` is the usual visually-hidden utility; the starter ships one, and any design system has an equivalent.

## State And Session

The order is resolved from the `sw-context-token`: `readOrder post /order` returns only orders that belong to the customer the token identifies. An order id alone grants nothing. Without a customer session the route does not return an empty result — it answers `403` with `CHECKOUT__CUSTOMER_NOT_LOGGED_IN`, so the page needs a logged-in or guest session before it loads anything.

The one way in without that session is the guest authentication the request body carries: a `filter` restricted to `deepLinkCode`, the buyer's `email`, the billing `zipcode` and `login`. `useOrderDetails` takes an order id and associations only, so that request is built with `apiClient.invoke` directly — and it is a two-step flow, because the code alone is rejected with `CHECKOUT__GUEST_NOT_AUTHENTICATED` until the credentials arrive with it. The [Guest Order Lookup recipe](guest-order-lookup.html) walks through it, including the error codes to branch on and the session token `login: true` establishes. Once that session exists, everything on this page works for a guest exactly as it does for a registered customer.

**Keep this route out of the shared HTML cache.** Loading from `onMounted` is deliberate: it is what keeps the order number, the addresses and the line items out of the server-rendered response. `vue-starter-template` applies `isr` to `/**` and opts `/account` and `/account/**` out of it with `ssr: false`, so the starter's own order page is safe — but mount an order page at another path, or refactor the load to `useAsyncData`/`callOnce`, and one customer's order is rendered into HTML that ISR then serves to everyone else. Personalized data does not belong in an ISR-cached response.

`useOrderDetails` keeps the loaded order in the `swOrderDetails` injection. That is a single slot, not a cache keyed by id, and it is shared along the provide/inject chain: a component that calls `useOrderDetails` provides its ref to everything below it, so a descendant calling the composable with a different id overwrites the ancestor's order. Two siblings get their own refs only when no ancestor called the composable — `inject` walks the whole parent chain and falls back to its default just on a miss, so under a providing ancestor both siblings share that one slot and whichever loads second wins.

The order id itself is read once, when the composable is created. It is a plain string, not a ref, so `loadOrderDetails`, `cancel` and `getMediaFile` keep pointing at the id the setup captured. In a Nuxt **page** this needs no work from you: Nuxt keys pages by their interpolated path, so `/account/order/details/[id]` remounts on its own when the id changes and `setup` re-runs. It matters for a **component** that receives the id as a prop — put a `:key` on it — and for any route where the id is not a path param.

The order is a snapshot. Its line items, prices and addresses are `OrderLineItem` and `OrderAddress` entities copied at order time, not references to the current product or customer address. Nothing that changes in the catalogue or the account afterwards is reflected here.

## Edge Cases

- `orders.elements` is empty when the id is unknown _or_ when the order belongs to a different customer. Distinguish "not found" from "not yours" in the UI at your own risk — the API does not. No session at all is a different case: that is a `403`, not an empty list.
- `shippingAddress` reads `deliveries[0].shippingOrderAddress`, so an order with no delivery — a purely digital order — has no shipping address at all.
- `billingAddress` is found by matching `billingAddressId` against the `addresses` association. Drop `addresses` from the associations and it becomes `undefined` even though the id is present.
- `paymentMethod` is the **last** transaction's method and `shippingMethod` the **last** delivery's. An order whose payment method was changed has more than one transaction, and the last one is the current one.
- `paymentChangeable` is only populated because `loadOrderDetails` sends `checkPromotion: true`. It is a map keyed by order id in the response, exposed as a boolean for this order, defaulting to `false`.
- `cancel()` cannot be reverted and returns the new `StateMachineState`. Whether it is allowed depends on the order state on the server, so a rejected call is a normal outcome, not a bug.
- `cancel()` is two awaits: the cancellation, then `loadOrderDetails()`. A rejection at the call site does not tell you which one failed, so the order may already be cancelled while the page still shows the old state. Word the message accordingly rather than claiming the cancellation failed.
- `getDocumentFile` needs both the document id and its `deepLinkCode`. Both come from the `documents` array the order already carries — it is not part of the default association tree and does not have to be added.
- A document download answers `204` when no such document is found — deprecated, and a `404` from 6.8.0.0 on. Today that resolves successfully with an empty body, so check the returned content before handing it to `downloadFile`. A `406` (unsupported mime type) and the later `404` throw like any other error status.
- `getDocumentFile` is typed `Promise<Blob | string>`, not `Promise<Blob>`, and the string arm is a document rather than a failure. Because the `accept` value never reaches the wire, which arm you get follows the document's own file type: a PDF is parsed as a `Blob`, while `text/html` and `application/xml` are parsed as text. Only `getMediaFile` returns a plain `Blob`. `downloadFile` is generic, so the compiler will not catch a `string` reaching it — `URL.createObjectURL` throws on one at runtime. Wrap the text in a `Blob`; rejecting it reports a perfectly good HTML document to the customer as missing.
- The `readOrder` body is the `fields`-less criteria variant, not the full `Criteria`. `associations`, `ids`, `filter` and the rest are identical, but passing `fields` is an excess property the type rejects.
- `getMediaFile` only works for line items whose `downloads` association is present, which the default associations request through `lineItems.downloads.media`.
- `handlePayment` declares a third `paymentDetails` argument in both composables, and neither implementation reads it. Payment data that a provider needs has to travel through that provider's own integration.
- `status` is the translated state name and `statusTechnicalName` the stable one. Branch on `statusTechnicalName`; show `status`.
- The order id is captured when the composable is created and never re-read. A Nuxt page remounts on an id change by itself, but a component holding the composable behind a prop does not — key it, or every action stays pointed at the previous order.

## Common Mistakes

- Do not treat `readOrder post /order` as a read-by-id. It is a search, and the order lives in `orders.elements[0]`.
- Do not replace the default associations when you only need one more. Pass the extra tree and let `defu` merge it.
- Do not branch on the translated `status` string. It changes with the language.
- Do not call `loadOrderDetails()` again after `useOrderDetails`' own `cancel()` or `changePaymentMethod()`. `useOrderPayment.changePaymentMethod()` is the exception — it does not reload anything.
- Do not call `useOrderDetails` for a second order below a component that already called it for a first. They share one `swOrderDetails` slot along the provide/inject chain.
- Do not expect a composable held by a component to follow a changing route param. Key that component on the id. A Nuxt page already remounts itself, so it needs no `definePageMeta` key for this.
- Do not resolve product data from an order line item against the current catalogue. The line item is a snapshot.
- Do not build a document URL by hand. `getDocumentFile` returns the binary and `downloadFile` from `@shopware/helpers` turns it into a download.
- Do not hand the result of `getDocumentFile` straight to `downloadFile`, and do not treat its string arm as an error. Wrap a string in a `Blob`, then check the result is non-empty — a missing document resolves with an empty body rather than throwing.
- Do not write `catch {}` without binding the error. You cannot log it, you cannot map it, and a programming error reaches the customer disguised as a failed order.
- Do not put a failed cancellation or download in the same slot as a failed load. The order is still valid; replacing it with the message destroys what the customer came to read.
- Do not show a cancel button for every state. Read `statusTechnicalName` first.

## Testing Checklist

- Opening the page sends exactly one `readOrder post /order` with the order id in `ids`.
- The request carries the default associations, and extra associations passed to the composable are merged rather than replacing them.
- An unknown order id renders an empty state instead of throwing, while a request made without any session fails with `403 CHECKOUT__CUSTOMER_NOT_LOGGED_IN`.
- Once a guest lookup has established a session, this page loads the order with no credentials of its own.
- `status` shows the translated state and `statusTechnicalName` the technical one.
- Line items, addresses, shipping method and payment method render from the associations without a second request.
- `cancel()` calls `cancelOrder post /order/state/cancel` and then reloads the order, and the rendered state changes.
- A rejected cancellation shows a UI-level error beside the button and leaves the rest of the order rendered.
- Downloading a document calls `download post /document/download/{documentId}/{deepLinkCode}` with the document's `deepLinkCode`, and the returned binary reaches the browser as a file.
- Downloading a document that no longer exists shows a message instead of doing nothing.
- An order without deliveries renders without a shipping address block.

## Related Links

- [Order History recipe](../account/order-history.html)
- [Guest Order Lookup recipe](guest-order-lookup.html)
- [Payment recipe](../checkout/payment.html)
- [Login recipe](../account/login.html)
- [Create a checkout](../../guides/e-commerce/checkout.html)
- [Payments](../../guides/e-commerce/payments.html)
- [Checkout and Order Placement recipe](../checkout/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Helpers package](../../packages/helpers.html)
