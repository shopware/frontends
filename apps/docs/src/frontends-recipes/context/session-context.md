---
nav:
  position: 10
recipe:
  area: context
  status: stable
  frameworks:
    - vue
  composables:
    - useSessionContext
    - useContext
  helpers: []
  operations:
    - readContext get /context
    - updateContext patch /context
    - contextGateway post /context/gateway
  schemas:
    - SalesChannelContext
    - Currency
    - CustomerAddress
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Root",
    action: "Seed the context once",
    detail:
      "The application root loads the context and passes it to useSessionContext(context). That argument is the only way the shared value is seeded, and it happens before any page renders.",
    code: "useSessionContext(contextResponse.data)",
    state: "swSessionContext",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "Components",
    action: "Inject, never refetch",
    detail:
      "Every later useSessionContext() call is made without an argument. useContext injects the same ref, so a header, a price and a checkout step read one context.",
    code: "const { currency, taxState } = useSessionContext()",
    state: "injected ref",
    typeKeys: ['Schemas["SalesChannelContext"]'],
  },
  {
    title: "UI",
    action: "Change one aspect",
    detail:
      "A setter takes one entity and patches only that field. There is no method that writes the whole context to the Store API.",
    code: "setCurrency({ id })",
    state: "none",
    typeKeys: ['Schemas["Currency"]'],
  },
  {
    title: "Store API",
    action: "Patch the context",
    detail:
      "PATCH /context accepts a narrow body of ids: currencyId, languageId, countryId, countryStateId, billingAddressId, shippingAddressId, paymentMethodId, shippingMethodId. It does not return the new context.",
    code: 'apiClient.invoke("updateContext patch /context", { body })',
    state: "sw-context-token",
    typeKeys: ['operations["updateContext patch /context"]["body"]'],
  },
  {
    title: "Composable",
    action: "Read the context back",
    detail:
      "Because the PATCH response is not the context, every setter awaits refreshSessionContext() and replaces the shared value with the GET result.",
    code: "await refreshSessionContext()",
    state: "swSessionContext",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "UI",
    action: "Re-render derived state",
    detail:
      "taxState, currency, countryId, activeShippingAddress and userFromContext are computed over the shared value, so the whole application reacts to one refresh.",
    code: "taxState.value === 'gross'",
    state: "reactive UI",
    typeKeys: ['Schemas["CustomerAddress"]'],
  },
];
</script>

# Session Context

## Goal

Read and change the sales channel context — currency, language, country, active addresses, shipping and payment method, tax state. The important part is that `PATCH /context` does not return the new context, so every setter has to read it back, and that the shared context value is seeded exactly once at the application root.

## Shopware Flow

The sales channel context is the server-side state attached to the `sw-context-token`. It decides which currency prices are calculated in, whether prices are gross or net, which country the shipping location is in, and which customer is logged in.

`PATCH /context` takes a narrow body of ids and responds with a token, not with the context. That is the single fact that shapes this whole recipe: a setter that only sends the PATCH leaves every reactive value in the application stale. `useSessionContext` therefore awaits `refreshSessionContext()` after every write.

<RecipeFlowDiagram label="Session context flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The application root calls `readContext get /context` and passes the result into `useSessionContext(context)`, which seeds the shared `swSessionContext` value.
2. Components call `useSessionContext()` without an argument and inject that same ref through `useContext`.
3. A UI action calls one setter, for example `setCurrency({ id })` or `setCountry(countryId)`.
4. The setter sends `updateContext patch /context` with a single id field.
5. The setter awaits `refreshSessionContext()`, which calls `readContext get /context` and replaces the shared value.
6. The UI reads `currency`, `taxState`, `countryId`, `activeShippingAddress` and `userFromContext` from computed properties instead of keeping its own copy.

You do not need to call `refreshSessionContext()` after a setter — every setter already does it. You also do not need to call it after login or logout, because `useUser()` refreshes the context itself.

## Request Flow

| Step                     | Code                                                       | Store API               | Type                                                                                        |
| ------------------------ | ---------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Load the context         | `refreshSessionContext()`                                  | `GET /context`          | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />         |
| Switch the currency      | `setCurrency({ id })`                                      | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Switch the country       | `setCountry(countryId)`                                    | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Set the shipping address | `setActiveShippingAddress({ id })`                         | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Set the shipping method  | `setShippingMethod({ id })`                                | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["response"]' />     |
| Seed the value locally   | `setContext(context)`                                      | none                    | <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />                             |
| Run a context gateway    | `apiClient.invoke("contextGateway post /context/gateway")` | `POST /context/gateway` | <SchemaTypeTooltip type-key='operations["contextGateway post /context/gateway"]["body"]' /> |

`setContext(context)` is synchronous and sends no request. It only overwrites the shared value, which is what you want when a context arrives from somewhere other than a `GET /context` — an SSR payload or a cross-tab sync message.

`contextGateway post /context/gateway` has no composable wrapper. It lets an app manipulate the context server-side by `appName`, and it also does not return a context, so follow it with `refreshSessionContext()`.

## Composables

- `useSessionContext`: the whole context surface. Reads `sessionContext`, `currency`, `taxState`, `countryId`, `salesChannelCountryId`, `currentLanguageId`, `salesChannelLanguageId`, `currentLocaleCode`, `activeShippingAddress`, `activeBillingAddress`, `selectedShippingMethod`, `selectedPaymentMethod`, `userFromContext`. Writes `setCurrency`, `setLanguage`, `setCountry`, `setActiveShippingAddress`, `setActiveBillingAddress`, `setShippingMethod`, `setPaymentMethod`, plus `refreshSessionContext` and the local-only `setContext`.
- `useContext`: the provide/inject helper `useSessionContext` is built on. You call it directly only when you add your own shared value under a named injection key.

## Types

Use generated Store API types when you need to type the context, a patch body, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />
  <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />
  <SchemaTypeTooltip type-key='Schemas["Currency"]' />
  <SchemaTypeTooltip type-key='Schemas["CustomerAddress"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type SessionContext = operations["readContext get /context"]["response"];
type UpdateContextBody = operations["updateContext patch /context"]["body"];
type SalesChannelContext = Schemas["SalesChannelContext"];
type Currency = Schemas["Currency"];
type CustomerAddress = Schemas["CustomerAddress"];
```

`UpdateContextBody` is the honest description of what a context switch can change. If a field is not on it, no setter can reach it.

## Minimal Vue Example

```vue
<script setup lang="ts">
const {
  sessionContext,
  currency,
  taxState,
  countryId,
  activeShippingAddress,
  userFromContext,
  setCountry,
  refreshSessionContext,
} = useSessionContext();

const isSwitching = ref(false);
const contextError = ref("");

const switchCountry = async (id: string) => {
  contextError.value = "";
  isSwitching.value = true;

  try {
    await setCountry(id);
  } catch {
    contextError.value = "The country could not be changed.";
    await refreshSessionContext();
  } finally {
    isSwitching.value = false;
  }
};
</script>

<template>
  <p v-if="!sessionContext">Loading the session…</p>

  <div v-else>
    <p v-if="contextError">{{ contextError }}</p>

    <dl>
      <dt>Currency</dt>
      <dd>{{ currency?.isoCode }}</dd>

      <dt>Prices</dt>
      <dd>{{ taxState === "gross" ? "including tax" : "excluding tax" }}</dd>

      <dt>Shipping country</dt>
      <dd>{{ sessionContext.shippingLocation?.country?.name }}</dd>

      <dt>Shipping address</dt>
      <dd v-if="activeShippingAddress">
        {{ activeShippingAddress.street }}, {{ activeShippingAddress.city }}
      </dd>
      <dd v-else>not selected yet</dd>

      <dt>Customer</dt>
      <dd>{{ userFromContext?.email ?? "guest" }}</dd>
    </dl>

    <button
      type="button"
      :disabled="isSwitching || !countryId"
      @click="switchCountry(countryId!)"
    >
      {{ isSwitching ? "Switching…" : "Re-apply the current country" }}
    </button>
  </div>
</template>
```

## State And Session

The Store API identifies the session with the `sw-context-token` header. The context is the server's view of that token, and the frontend never owns it — it only mirrors the last `GET /context` response.

That mirror lives in the `swSessionContext` injection provided by `useContext`. Passing a context into `useSessionContext(context)` sets it; calling `useSessionContext()` with no argument injects it. Because `useContext` uses `provideLocal`/`injectLocal`, the seeding call has to happen in the root component, above every consumer.

`refreshSessionContext()` rethrows after logging. That matters for flows that must not continue on a half-applied switch, such as logout or the last checkout step — treat a rejection there as a blocking error rather than a warning.

## Edge Cases

- `sessionContext` is `undefined` until the root seeds it. Guard on it before reading nested fields during the first render.
- `taxState` comes from `context.taxState` and is `"gross"` or `"net"`. Every formatted price on the page depends on it, so a context switch invalidates cached price strings.
- `countryId` is the _shipping location_ country from `shippingLocation.country.id`, while `salesChannelCountryId` is the sales channel default. They differ as soon as the customer picks a different shipping country.
- `activeShippingAddress` falls back to `shippingLocation.address` when there is no logged-in customer, but `activeBillingAddress` has no fallback and stays `null` for a guest.
- `setCurrency` and `setLanguage` return silently when the entity has no `id`, while `setShippingMethod`, `setPaymentMethod`, `setActiveShippingAddress` and `setActiveBillingAddress` throw. Do not assume a uniform failure mode.
- `languageId` and `languageIdChain` are deprecated aliases of `salesChannelLanguageId` and `currentLanguageId`. The pair is not interchangeable: one is the sales channel default, the other the currently active language.
- `currentLocaleCode` is read from `languageInfo.localeCode` on the context, so detecting the active locale needs no `readLanguages post /language` request.
- A currency or language switch changes prices and translated content. Anything already fetched — a listing, a cart summary, a product detail — is stale until it is refetched.

## Common Mistakes

- Do not call `useSessionContext(context)` with an argument outside the application root. A second seeding call replaces the shared value for everything below it.
- Do not send `updateContext patch /context` through `apiClient.invoke` and stop there. Without a following `refreshSessionContext()` the UI shows the old context.
- Do not use `setContext()` to apply a user-facing switch. It changes only local state and the server still has the previous context.
- Do not keep a local copy of the currency, the tax state or the active address.
- Do not read `taxState` once and cache the result. It is a `ComputedRef` for a reason.
- Do not treat a rejected `refreshSessionContext()` as recoverable in checkout or logout. The context may be partially applied.

## Testing Checklist

- The root seeds the context with `readContext get /context` before the first page renders.
- A second `useSessionContext()` call in a child component returns the same reactive context without issuing a request.
- `setCountry(id)` calls `updateContext patch /context` once and then `readContext get /context` once.
- After a successful switch, `countryId` and `sessionContext.shippingLocation.country` reflect the new country.
- A failing `PATCH /context` leaves the previously rendered context intact and surfaces a UI-level error.
- `setCurrency({})` without an id issues no request.
- `setShippingMethod({})` without an id throws instead of issuing a request.
- `activeBillingAddress` is `null` for a guest session and set after login.

## Related Links

- [Languages documentation](../../getting-started/languages.html)
- [Login recipe](../account/login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Prices documentation](../../getting-started/e-commerce/prices.html)
