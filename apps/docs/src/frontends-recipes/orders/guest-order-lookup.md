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
    - useUser
  helpers: []
  operations:
    - readOrder post /order
  schemas:
    - Order
    - OrderRouteResponse
    - failure
---

<script setup>
import CodeExample from "../../components/CodeExample.vue";
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Open the deep link",
    detail:
      "The customer arrives from an order confirmation mail on a route carrying only a deep link code. There is no session and no order id.",
    code: "const deepCode = route.params.deepCode",
    state: "route param deepCode",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Try the code alone",
    detail:
      "The first attempt sends only the deepLinkCode filter. No composable wraps this, because the filter is the authentication mechanism rather than a search refinement.",
    code: 'apiClient.invoke("readOrder post /order", { body: { filter: [{ field: "deepLinkCode", type: "equals", value: deepCode }] } })',
    state: "none yet",
    typeKeys: ['operations["readOrder post /order"]["body"]'],
  },
  {
    title: "Error",
    action: "Read the failure code",
    detail:
      "For a guest order the call rejects with CHECKOUT__GUEST_NOT_AUTHENTICATED. That is not a bug — it is the signal to ask for the email and the postal code.",
    code: 'new Set(error.details.errors.map((e) => e.code)).has("CHECKOUT__GUEST_NOT_AUTHENTICATED")',
    state: "needsCredentials",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Collect two fields",
    detail:
      "The form asks for the email address and the billing postal code of the order. Nothing else identifies a guest, and neither field is a password.",
    code: "credentials.email, credentials.zipcode",
    state: "local form state",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Authenticate and read",
    detail:
      "The retry adds email, zipcode and login: true. The response carries a new sw-context-token header, which the API client adopts as the current session.",
    code: "body: { filter, email, zipcode, login: true }",
    state: "sw-context-token",
    typeKeys: ['operations["readOrder post /order"]["response"]'],
  },
  {
    title: "UI",
    action: "Reuse the order page",
    detail:
      "From here the guest has a session, so the normal detail component works. useOrderDetails(order.id) loads the order with its associations like any logged-in customer.",
    code: "useOrderDetails(order.id).loadOrderDetails()",
    state: "swOrderDetails",
    typeKeys: ['Schemas["Order"]'],
  },
];
</script>

# Guest Order Lookup via Deep Link

## Goal

Let a customer who ordered without an account open their order from the link in the confirmation mail. The important part is that the deep link code is not enough on its own: the first request is expected to fail, and its error code is what tells you to ask for the email and postal code.

## Shopware Flow

A guest order has no customer session behind it, so `readOrder post /order` cannot resolve it from the `sw-context-token`. Instead the operation accepts four extra fields that exist only for this case: a `filter` restricted to `deepLinkCode`, an `email`, a `zipcode`, and `login`.

The flow is therefore two requests, not one. The first sends just the code and is _supposed_ to reject with `CHECKOUT__GUEST_NOT_AUTHENTICATED`. The second adds the two credentials and `login: true`, and the Store API answers with a new `sw-context-token` header that turns the visitor into a logged-in guest for the rest of the session.

<RecipeFlowDiagram label="Guest order lookup flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer opens a route that carries only the order's `deepLinkCode`.
2. `readOrder post /order` is sent with the `deepLinkCode` filter and nothing else.
3. The call rejects with `CHECKOUT__GUEST_NOT_AUTHENTICATED`, which the page reads as "ask for credentials".
4. A form collects the email address and the billing postal code of the order.
5. The request is repeated with `filter`, `email`, `zipcode` and `login: true`, and the response header establishes a guest session.
6. With a session in place, `useOrderDetails(order.id)` renders the order exactly as it does for a registered customer — the [Order Details recipe](details.html) takes it from there.

You do not need a separate authentication request. `login: true` on this operation is the login, which is why no composable wraps it — the credentials belong to one order, not to an account.

## Request Flow

| Step                      | Code                                                    | Store API     | Type                                                                             |
| ------------------------- | ------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| Try the deep link code    | `invoke("readOrder post /order", { body: { filter } })` | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />     |
| Read the rejection        | `error.details.errors[].code`                           | `POST /order` | <SchemaTypeTooltip type-key='Schemas["failure"]' />                              |
| Authenticate the guest    | `body: { filter, email, zipcode, login: true }`         | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />     |
| Read the order            | `data.orders?.elements?.[0]`                            | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' /> |
| Load the full detail view | `useOrderDetails(order.id).loadOrderDetails()`          | `POST /order` | <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />                   |

The first two rows are the same operation. Only the body differs, and the second body is what the customer's two form fields produce.

## Composables

Pick by scope — how much of the visitor's session the composable is about:

| Composable        | Scope                      | Reach for it when                             |
| ----------------- | -------------------------- | --------------------------------------------- |
| `useUser`         | the session behind the tab | deciding what kind of visitor opened the link |
| `useOrderDetails` | one order                  | rendering the order once a session exists     |

The lookup itself has no composable. `useOrderDetails` is what you reach for afterwards:

- **Read** — `order`, `status`, `statusTechnicalName`, `total`, `subtotal`, `shippingCosts`, `billingAddress`, `shippingAddress`, `personalDetails`, `shippingMethod`, `paymentMethod`, `paymentChangeable`, `documents`, `hasDocuments`.
- **Load** — `loadOrderDetails()` re-reads the order through `readOrder post /order` and returns the whole `OrderRouteResponse`, including `paymentChangeable`.
- **Act** — `cancel()`, `getDocumentFile()`, `getMediaFile()`, and the payment members `handlePayment()` and `changePaymentMethod()`, which the [Payment recipe](../checkout/payment.html) covers in full.

Three things the generated reference will not tell you:

- `useOrderDetails(orderId)` takes the order **id**, not the deep link code. The id is only available after the lookup succeeded, which is why the composable cannot drive the first two requests.
- It does not fetch on its own. Nothing is populated until you call `loadOrderDetails()`, which is what adds the default associations from `useDefaultOrderAssociations` — the lookup response has none of them.
- Its state is shared through a single `provide`/`inject` key, `swOrderDetails`, and that key carries no order id. A child calling `useOrderDetails` with a **different** id reads the parent's order, and calling `loadOrderDetails()` does not isolate it — the composable re-provides the ref it injected, so the child's load overwrites the shared value and the parent starts rendering the child's order. Render one order per tree.

On `useUser`, one member is easy to misread here: `isLoggedIn` is `!!user.id && user.active && !user.guest`, so it stays **false** for a guest who just authenticated through `login: true`. Use `isGuestSession` for that visitor and `isCustomerSession` for a registered one. Both read from `user`, which is synced from the sales channel context rather than fetched on its own: `refreshSessionContext()` populates it, and so does `refreshUser()`.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the lookup body, the search response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
  <SchemaTypeTooltip type-key='Schemas["failure"]' />
</div>

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/orders/guest-order-lookup/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type GuestLookupFilter = NonNullable<ReadOrderBody["filter"]>;
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
```

<!-- /automd -->

`GuestLookupFilter` is worth resolving in your editor rather than in the tooltip above: its `field` is restricted to the literal `"deepLinkCode"` and its `type` to `"equals"`. This is not a general-purpose criteria filter. The body tooltip cannot show you that — it renders `filter` as a plain `object[]`, and because the body is a criteria object with eighteen properties it truncates after the first eight, so `email`, `zipcode` and `login` are not in it either. Hover it for the criteria shape; read the generated type for the four fields this recipe is about.

## Minimal Vue Example

<CodeExample title="Minimal guest order lookup page">

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/orders/guest-order-lookup/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const deepCode = useRoute().params.deepCode as string;

const order = ref<Schemas["Order"] | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const notFound = ref(false);
const needsCredentials = ref(false);
const credentialsError = ref("");
const loadError = ref("");

const heading = ref<HTMLElement | null>(null);
const credentials = reactive({ email: "", zipcode: "" });

const GENERIC_FAILURE = "This order could not be opened.";

const lookupOrder = async (withGuestCredentials: boolean) => {
  notFound.value = false;
  credentialsError.value = "";
  loadError.value = "";

  // The retry has a form on screen to report into; the first attempt does not.
  const reportFailure = (message: string) => {
    if (withGuestCredentials) credentialsError.value = message;
    else loadError.value = message;
  };

  try {
    const { data } = await apiClient.invoke("readOrder post /order", {
      body: {
        filter: [{ field: "deepLinkCode", type: "equals", value: deepCode }],
        ...(withGuestCredentials
          ? {
              email: credentials.email,
              zipcode: credentials.zipcode,
              login: true,
            }
          : {}),
      },
    });

    order.value = data.orders?.elements?.[0] ?? null;
    notFound.value = !order.value;
    needsCredentials.value = false;
  } catch (error) {
    // A timeout, an abort or a dropped connection is not an ApiClientError.
    // Rethrowing here would reach nothing: Nuxt clears its own error handler
    // once suspense resolves, so the rejection would end as a console.error
    // and leave the customer on a page with no branch rendered.
    if (!(error instanceof ApiClientError)) {
      console.error(error);
      reportFailure(`${GENERIC_FAILURE} Please try again.`);
      return;
    }

    // Decide once, from the whole payload. Looping and assigning per error
    // lets the last element overwrite the message the customer can act on.
    const codes = new Set(
      error.details.errors.map((apiError: { code?: string }) => apiError.code),
    );

    if (codes.has("CHECKOUT__GUEST_NOT_AUTHENTICATED")) {
      needsCredentials.value = true;
    }

    if (codes.has("CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND")) {
      notFound.value = true;
    } else if (codes.has("CHECKOUT__GUEST_WRONG_CREDENTIALS")) {
      needsCredentials.value = true;
      credentialsError.value =
        "The email address or postal code does not match this order.";
    } else if (!needsCredentials.value) {
      reportFailure(GENERIC_FAILURE);
    }
  }
};

const loadOrder = async () => {
  isLoading.value = true;

  try {
    await lookupOrder(false);
  } finally {
    isLoading.value = false;
  }
};

const submitCredentials = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await lookupOrder(true);
  } finally {
    isSubmitting.value = false;
  }
};

// The form appears after an async failure, so nothing has moved focus to it.
watch(needsCredentials, async (isNeeded) => {
  if (!isNeeded) return;
  await nextTick();
  heading.value?.focus();
});

onMounted(loadOrder);
</script>

<template>
  <section>
    <!-- One heading outside the branch chain, so every state has a landmark
         and a focus target. -->
    <h1 ref="heading" tabindex="-1">
      {{ order ? `Order ${order.orderNumber}` : "Your order" }}
    </h1>

    <p v-if="isLoading" role="status">Looking up your order…</p>

    <p v-else-if="notFound" role="alert">
      This link is no longer valid. Please use the link from your order
      confirmation mail.
    </p>

    <div v-else-if="loadError" role="alert">
      <p>{{ loadError }}</p>
      <button type="button" @click="loadOrder">Try again</button>
    </div>

    <!-- isSubmitting rather than isLoading: the form must stay mounted while
         the retry is in flight, or it takes the focused button with it. -->
    <form
      v-else-if="needsCredentials && !order"
      :aria-busy="isSubmitting"
      @submit.prevent="submitCredentials"
    >
      <p>Confirm the details you used for this order.</p>

      <p v-if="credentialsError" id="credentials-error" role="alert">
        {{ credentialsError }}
      </p>

      <label>
        Email
        <input
          v-model="credentials.email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="credentialsError ? 'true' : undefined"
          :aria-describedby="credentialsError ? 'credentials-error' : undefined"
        />
      </label>

      <label>
        Postal code
        <input
          v-model="credentials.zipcode"
          type="text"
          autocomplete="postal-code"
          required
          :aria-invalid="credentialsError ? 'true' : undefined"
          :aria-describedby="credentialsError ? 'credentials-error' : undefined"
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Checking…" : "Show my order" }}
      </button>
    </form>

    <article v-else-if="order">
      <p>{{ order.stateMachineState?.translated?.name }}</p>
      <p>{{ order.price?.totalPrice }}</p>
    </article>

    <!-- Terminal branch. Without it an unhandled state renders an empty page. -->
    <p v-else role="alert">
      {{ GENERIC_FAILURE }} Please use the link from your order confirmation
      mail.
    </p>
  </section>
</template>
```

<!-- /automd -->

</CodeExample>

Once `order` is set, hand `order.id` to a component built on `useOrderDetails` to render the full detail view — the guest session established by `login: true` is all that component needs.

**Keep this route out of the shared HTML cache.** Loading from `onMounted` is deliberate: it is what keeps the order number, the order state and the total out of the server-rendered response. `vue-starter-template` applies `isr` to `/**` and opts `/account` and `/account/**` out of it with `ssr: false`, so the page is safe there — but drop this example at another path, or move the load to a top-level `await`, and one customer's order is rendered into HTML that ISR then serves to everyone else. Personalized data does not belong in an ISR-cached response.

`vue-starter-template` ships this page at `app/pages/account/order/[deepCode].vue`. It differs from the example above in two ways worth knowing: it fetches at the top level of `<script setup>` rather than in `onMounted`, and it builds one request body that always carries `email`, `zipcode` and `login: true` — empty strings on the first pass — instead of branching. The top-level `await` suspends the route rather than rendering a loading state, so on a client-side navigation the visitor stays on the previous page until the lookup settles; it does not buy you SSR, because the starter's `"/account/**": { ssr: false }` rule already puts that route in the browser. Both shapes work; the example here separates the two attempts so the error-driven step is visible.

## State And Session

The deep link code is a per-order secret, not a session. On its own it identifies the order to the Store API but does not authorise reading it, which is why the credentials are required.

`login: true` changes that. The Store API answers with an `sw-context-token` response header, and the API client adopts it: `createAPIClient` compares the header against its current default and replaces it when they differ, then fires the `onContextChanged` hook. From that point the visitor has a guest session and ordinary order requests work.

There is one exception to that adoption. A response marked `Cache-Control: public` is ignored for token updates, because a shared cache or CDN can replay a stale guest token and silently replace the caller's session. That guard is why a token never appears from a cached read. It does not affect the guest login, which is a `POST` carrying credentials and is not served from a shared cache.

## Edge Cases

- The first request failing with `CHECKOUT__GUEST_NOT_AUTHENTICATED` is the normal path, not an error to report. Only render the credential form on that code.
- `CHECKOUT__GUEST_WRONG_CREDENTIALS` and `CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND` need different UI. The first is a retry, the second is a dead end.
- A successful call can still return an empty `orders.elements`. Treat that as not found rather than reading `elements[0]` blindly.
- `zipcode` is the postal code of the order's **billing** address. A customer who reads it off a delivery label may enter the wrong one.
- A customer who is already logged in reaches the same route with a session, and the lookup resolves on the first request. The form never renders for them, because no `CHECKOUT__GUEST_NOT_AUTHENTICATED` arrives.
- The email and postal code are order data, not account credentials. Do not store them, and do not offer to remember them.
- Any response that carries a different `sw-context-token` replaces the client's session, so a successful guest login swaps whatever session the tab had. Treat the guest lookup as a route that can change the current visitor, not as a read-only page.
- The credentials survive only as long as the resulting session. A reload without them starts the two-request dance again.

## Common Mistakes

- Do not push the first rejection into a notification. It is expected.
- Do not branch on the HTTP status. The three outcomes differ only by `error.details.errors[].code`.
- Do not read the first rejection as a reason to stop. Sending the credentials up front is fine — the starter template does exactly that with empty strings — but you still have to handle `CHECKOUT__GUEST_NOT_AUTHENTICATED`, because an empty `email` or `zipcode` produces it just the same.
- Do not use the `filter` array for anything else. Its `field` is restricted to `deepLinkCode`.
- Do not build the detail view from the lookup response. It has no associations — reload through `useOrderDetails`, as the [Order Details recipe](details.html) describes.
- Do not put the deep link code in an error message or an analytics event. It grants access to the order.
- Do not render the raw `detail` of the API error next to the form. Map each code to a sentence the customer can act on.
- Do not end the branch chain without a terminal `v-else`. Every unmapped state then renders an empty page, and the customer has no way to tell a dead link from a broken one.
- Do not assume every rejection is an `ApiClientError`. A timeout, an abort or a dropped connection is a `FetchError`, and rethrowing it reaches nothing — Nuxt clears its own error handler once suspense resolves.
- Do not decide per error inside a loop over `error.details.errors`. Assigning in each iteration lets the last element overwrite the message the customer could have acted on; read the codes into a set and decide once.
- Do not gate the credential form on the same flag as the initial load. Submitting then unmounts the form and the focused button, and the retry's error message is announced to nobody.

## Testing Checklist

- Opening the link without a session sends one `readOrder post /order` whose only usable credential is the `deepLinkCode` filter.
- A `CHECKOUT__GUEST_NOT_AUTHENTICATED` rejection renders the credential form and no notification.
- Submitting matching credentials repeats the request with `email`, `zipcode` and `login: true`.
- A successful authentication establishes a session, so a following order request needs no credentials.
- Wrong credentials keep the form on screen with a field-level message.
- An unknown or expired code renders the dead-end state instead of the form.
- A response with an empty `orders.elements` is treated as not found.
- A logged-in customer opening the same link sees the order without the form.
- An unmapped error code, and a failure that is not an `ApiClientError` at all, both render a message and a retry rather than an empty page.
- Submitting the form keeps it on screen; focus stays reachable and the rejection is announced.

## Related Links

- [Checkout and Order Placement recipe](../checkout/checkout.html)
- [Payment recipe](../checkout/payment.html)
- [Order Details recipe](details.html)
- [Login recipe](../account/login.html)
- [Order History recipe](../account/order-history.html)
- [Create a checkout](../../guides/e-commerce/checkout.html)
- [Error handling in the API client](../../packages/api-client.html#error-handling)
- [Composables reference](../../packages/composables/)
- [Reference implementation in `vue-starter-template`](https://github.com/shopware/frontends/blob/main/templates/vue-starter-template/app/pages/account/order/%5BdeepCode%5D.vue)
