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
    - useUser
  helpers: []
  operations:
    - readOrder post /order
  schemas:
    - Order
    - OrderRouteResponse
---

<script setup>
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
    code: "error.code === 'CHECKOUT__GUEST_NOT_AUTHENTICATED'",
    state: "showAuthForm",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Collect two fields",
    detail:
      "The form asks for the email address and the billing postal code of the order. Nothing else identifies a guest, and neither field is a password.",
    code: "auth.email, auth.zipcode",
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
6. With a session in place, `useOrderDetails(order.id)` renders the order exactly as it does for a registered customer.

You do not need a separate authentication request. `login: true` on this operation is the login, which is why no composable wraps it — the credentials belong to one order, not to an account.

## Request Flow

| Step                      | Code                                                    | Store API     | Type                                                                             |
| ------------------------- | ------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| Try the deep link code    | `invoke("readOrder post /order", { body: { filter } })` | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />     |
| Read the rejection        | `error.details.errors[].code`                           | `POST /order` | <SchemaTypeTooltip type-key='components["schemas"]["failure"]' />                |
| Authenticate the guest    | `body: { filter, email, zipcode, login: true }`         | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />     |
| Read the order            | `data.orders?.elements?.[0]`                            | `POST /order` | <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' /> |
| Load the full detail view | `useOrderDetails(order.id).loadOrderDetails()`          | `POST /order` | <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />                   |

The first two rows are the same operation. Only the body differs, and the second body is what the customer's two form fields produce.

## Composables

- `useOrderDetails`: used only after the guest session exists. Reload the order through it with the order id from the lookup, so the page gets the default associations, `paymentChangeable`, documents and the cancel action.
- `useUser`: `isLoggedIn` and `isGuestSession` tell you whether the visitor arrived with a session already. A logged-in customer following the same link never sees the credential form.

## Types

Use generated Store API types when you need to type the lookup body, the search response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readOrder post /order"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["OrderRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Order"]' />
  <SchemaTypeTooltip type-key='components["schemas"]["failure"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ReadOrderBody = operations["readOrder post /order"]["body"];
type GuestLookupFilter = NonNullable<ReadOrderBody["filter"]>;
type OrderRouteResponse = Schemas["OrderRouteResponse"];
type Order = Schemas["Order"];
```

`GuestLookupFilter` is worth reading in the tooltip: its `field` is restricted to the literal `"deepLinkCode"` and its `type` to `"equals"`. This is not a general-purpose criteria filter.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const deepCode = useRoute().params.deepCode as string;

const order = ref<Schemas["Order"] | null>(null);
const isLoading = ref(true);
const notFound = ref(false);
const needsCredentials = ref(false);
const credentialsError = ref("");

const auth = reactive({ email: "", zipcode: "" });

const lookupOrder = async (withCredentials: boolean) => {
  notFound.value = false;
  credentialsError.value = "";

  try {
    const { data } = await apiClient.invoke("readOrder post /order", {
      body: {
        filter: [{ field: "deepLinkCode", type: "equals", value: deepCode }],
        ...(withCredentials
          ? { email: auth.email, zipcode: auth.zipcode, login: true }
          : {}),
      },
    });

    order.value = data.orders?.elements?.[0] ?? null;
    notFound.value = !order.value;
    needsCredentials.value = false;
  } catch (error) {
    if (!(error instanceof ApiClientError)) throw error;

    for (const apiError of error.details.errors) {
      switch (apiError.code) {
        case "CHECKOUT__GUEST_NOT_AUTHENTICATED":
          needsCredentials.value = true;
          break;
        case "CHECKOUT__GUEST_WRONG_CREDENTIALS":
          credentialsError.value =
            "The email address or postal code does not match this order.";
          break;
        case "CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND":
          notFound.value = true;
          break;
        default:
          credentialsError.value = "This order could not be opened.";
      }
    }
  }
};

const submitCredentials = async () => {
  isLoading.value = true;

  try {
    await lookupOrder(true);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await lookupOrder(false);
  isLoading.value = false;
});
</script>

<template>
  <p v-if="isLoading">Looking up your order…</p>

  <p v-else-if="notFound">
    This link is no longer valid. Please use the link from your order
    confirmation mail.
  </p>

  <form
    v-else-if="needsCredentials && !order"
    @submit.prevent="submitCredentials"
  >
    <p>Confirm the details you used for this order.</p>

    <label>
      Email
      <input v-model="auth.email" type="email" autocomplete="email" required />
    </label>

    <label>
      Postal code
      <input
        v-model="auth.zipcode"
        type="text"
        autocomplete="postal-code"
        required
      />
    </label>

    <p v-if="credentialsError">{{ credentialsError }}</p>

    <button type="submit">Show my order</button>
  </form>

  <article v-else-if="order">
    <h1>Order {{ order.orderNumber }}</h1>
    <p>{{ order.stateMachineState?.translated?.name }}</p>
    <p>{{ order.price?.totalPrice }}</p>
  </article>
</template>
```

Once `order` is set, hand `order.id` to a component built on `useOrderDetails` to render the full detail view — the guest session established by `login: true` is all that component needs.

## State And Session

The deep link code is a per-order secret, not a session. On its own it identifies the order to the Store API but does not authorise reading it, which is why the credentials are required.

`login: true` changes that. The Store API answers with an `sw-context-token` response header, and the API client adopts it: `createAPIClient` compares the header against its current default and replaces it when they differ, then fires the `onContextChanged` hook. From that point the visitor has a guest session and ordinary order requests work.

There is one exception to that adoption. A response marked `Cache-Control: public` is ignored for token updates, because a shared cache or CDN can replay a stale guest token and silently replace the caller's session. Session-changing routes respond as `private`, so the guest login is unaffected — but it is the reason a token never appears from a cached read.

## Edge Cases

- The first request failing with `CHECKOUT__GUEST_NOT_AUTHENTICATED` is the normal path, not an error to report. Only render the credential form on that code.
- `CHECKOUT__GUEST_WRONG_CREDENTIALS` and `CHECKOUT__CART_ORDER_DEEP_LINK_NOT_FOUND` need different UI. The first is a retry, the second is a dead end.
- A successful call can still return an empty `orders.elements`. Treat that as not found rather than reading `elements[0]` blindly.
- `zipcode` is the postal code of the order's **billing** address. A customer who reads it off a delivery label may enter the wrong one.
- A customer who is already logged in reaches the same route with a session. Skip the form for them: the plain deep link lookup succeeds.
- The email and postal code are order data, not account credentials. Do not store them, and do not offer to remember them.
- `login: true` replaces the current session token. Following a guest deep link while logged in as a different customer changes who the application thinks you are.
- The credentials survive only as long as the resulting session. A reload without them starts the two-request dance again.

## Common Mistakes

- Do not push the first rejection into a notification. It is expected.
- Do not branch on the HTTP status. The three outcomes differ only by `error.details.errors[].code`.
- Do not send `email` and `zipcode` on the first attempt to save a round trip. A logged-in customer would then be authenticated as a guest.
- Do not use the `filter` array for anything else. Its `field` is restricted to `deepLinkCode`.
- Do not build the detail view from the lookup response. It has no associations — reload through `useOrderDetails`.
- Do not put the deep link code in an error message or an analytics event. It grants access to the order.
- Do not render the raw `detail` of the API error next to the form. Map each code to a sentence the customer can act on.

## Testing Checklist

- Opening the link without a session sends one `readOrder post /order` carrying only the `deepLinkCode` filter.
- A `CHECKOUT__GUEST_NOT_AUTHENTICATED` rejection renders the credential form and no notification.
- Submitting matching credentials repeats the request with `email`, `zipcode` and `login: true`.
- A successful authentication establishes a session, so a following order request needs no credentials.
- Wrong credentials keep the form on screen with a field-level message.
- An unknown or expired code renders the dead-end state instead of the form.
- A response with an empty `orders.elements` is treated as not found.
- A logged-in customer opening the same link sees the order without the form.

## Related Links

- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Login recipe](../account/login.html)
- [API client package](../../packages/api-client.html)
- [Composables reference](../../packages/composables/)
