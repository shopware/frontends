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
    - useInternationalization
  helpers: []
  operations:
    - readContext get /context
    - updateContext patch /context
    - contextGateway post /context/gateway
    - contextGatewayGet get /context/gateway
  schemas:
    - SalesChannelContext
    - Currency
    - CustomerAddress
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Root",
    action: "Seed the context once",
    detail:
      "The application root loads the context and passes it to useSessionContext(context). That argument seeds the shared value from the Store API, before any page renders.",
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
      "PATCH /context accepts a narrow body of ids: currencyId, languageId, countryId, countryStateId, billingAddressId, shippingAddressId, paymentMethodId, shippingMethodId. It answers with the sw-context-token header and a body that carries only an optional redirectUrl — never the new context.",
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

Read and change the sales channel context — currency, language, country, active addresses, shipping and payment method, tax state. The important part is that `PATCH /context` does not return the new context, so every setter has to read it back, and that the shared context value is seeded at the application root instead of being fetched per component.

## Shopware Flow

The sales channel context is the server-side state attached to the `sw-context-token`. It decides which currency prices are calculated in, whether prices are gross or net, which country the shipping location is in, and which customer is logged in.

`PATCH /context` takes a narrow body of ids and answers with the `sw-context-token` header; its JSON body holds only an optional `redirectUrl`, never the new context. That is the single fact that shapes this whole recipe: a setter that only sends the PATCH leaves every reactive value in the application stale. `useSessionContext` therefore awaits `refreshSessionContext()` after every write.

<RecipeFlowDiagram label="Session context flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The application root calls `readContext get /context` and passes the result into `useSessionContext(context)`, which seeds the shared `swSessionContext` value. Call it directly rather than through `useAsyncData`, for the reason in [State And Session](#state-and-session).
2. Components call `useSessionContext()` without an argument and inject that same ref through `useContext`.
3. A UI action calls one setter, for example `setCurrency({ id })` or `setCountry(countryId)`.
4. The setter sends `updateContext patch /context` with a single id field.
5. The setter awaits `refreshSessionContext()`, which calls `readContext get /context` and replaces the shared value.
6. The UI reads `currency`, `taxState`, `countryId`, `activeShippingAddress` and `userFromContext` from computed properties instead of keeping its own copy.

You do not need to call `refreshSessionContext()` after a setter from `useSessionContext()` — every one of them already does it. You also do not need to call it after login, registration or logout, because `useUser()` refreshes the context itself.

## Request Flow

| Step                     | Code                                                                              | Store API               | Type                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Load the context         | `refreshSessionContext()`                                                         | `GET /context`          | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />         |
| Switch the currency      | `setCurrency({ id })`                                                             | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Switch the language      | `setLanguage({ id })`                                                             | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Switch the country       | `setCountry(countryId)`                                                           | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Set the shipping address | `setActiveShippingAddress({ id })`                                                | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Set the shipping method  | `setShippingMethod({ id })`                                                       | `PATCH /context`        | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />         |
| Seed the value locally   | `setContext(context)`                                                             | none                    | <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />                             |
| Run a context gateway    | `apiClient.invoke("contextGateway post /context/gateway", { body: { appName } })` | `POST /context/gateway` | <SchemaTypeTooltip type-key='operations["contextGateway post /context/gateway"]["body"]' /> |

Every `PATCH /context` response can carry a `redirectUrl`. It is absent for a plain currency or country switch, and set when an app wants the browser to continue somewhere else before the switch is finished — follow it instead of dropping it.

`setContext(context)` is synchronous and sends no request. It only overwrites the shared value, which is what you want when a context arrives from somewhere other than a `GET /context` — an SSR payload or a cross-tab sync message.

`contextGateway post /context/gateway` has no composable wrapper. It lets an app manipulate the context server-side; the body requires `appName` and takes an optional `data` record, and the call does not type-check without it. Like a context patch it does not return a context, so follow it with `refreshSessionContext()`. The same operation exists as `contextGatewayGet get /context/gateway`, which takes `appName` as a query parameter.

## Composables

Pick by scope — how much of the session the composable is about:

| Composable                | Scope                                   | Reach for it when                                                                        |
| ------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `useSessionContext`       | the whole sales channel context         | reading or switching currency, language, country, addresses, shipping and payment method |
| `useContext`              | one named injection key                 | you need your own application-wide shared ref with the same provide/inject mechanics     |
| `useInternationalization` | the language switch and storefront URLs | switching the language as part of a navigation, or building a localized link             |

`useSessionContext` is the one you reach for:

- **Read** — `sessionContext`, `currency`, `taxState`, `countryId`, `salesChannelCountryId`, `salesChannelLanguageId`, `currentLanguageId`, `currentLocaleCode`, `activeShippingAddress`, `activeBillingAddress`, `selectedShippingMethod`, `selectedPaymentMethod`, `userFromContext`.
- **Write** — `setCurrency`, `setLanguage`, `setCountry`, `setActiveShippingAddress`, `setActiveBillingAddress`, `setShippingMethod`, `setPaymentMethod`. Each one patches a single field and then awaits `refreshSessionContext()`.
- **Local** — `setContext(context)` overwrites the shared value without a request, `refreshSessionContext()` reloads it from `GET /context`.

Seven things the generated reference will not tell you:

- `useSessionContext()` has to run in `setup` or inside an active effect scope. `useContext` calls VueUse's `provideLocal` on every invocation, and that function throws `"provideLocal must be called in setup"` when there is neither a component instance nor a scope — so a call from an event handler or a plain module fails loudly instead of returning an empty context.
- The setters do not fail the same way. `setShippingMethod`, `setActiveShippingAddress` and `setActiveBillingAddress` take a `Partial<>` and throw at runtime when the id is missing; `setPaymentMethod` requires `{ id: string }`, so the same mistake is a compile error rather than a throw; `setLanguage` returns without a request; `setCurrency` logs the problem with `console.error` and then returns; `setCountry` takes a plain string and validates nothing.
- `setCurrency` and `setLanguage` take a `Partial<Schemas["Currency"]>` and a `Partial<Schemas["Language"]>`, so you can pass the whole entity you already rendered — only `id` is read from it.
- `useInternationalization().changeLanguage(languageId)` sends the same `updateContext patch /context` and deliberately does **not** refresh the shared context. It is meant for a language switch that continues with a navigation or reload; if you call it and stay on the page, follow it with `refreshSessionContext()` yourself.
- `countryStateId` is part of the patch body but has no setter. Reaching it means calling `apiClient.invoke("updateContext patch /context", { body: { countryStateId } })` directly and refreshing afterwards.
- `salesChannelLanguageId` and `currentLanguageId` are the current names of `languageId` and `languageIdChain`, which are deprecated aliases of the very same computed properties. `currentLanguageId` reads the first entry of `context.languageIdChain` and falls back to an empty string at runtime — but it is declared `ComputedRef<string | undefined>`, so you still have to narrow it before passing it somewhere that wants a `string`.
- `setContext` exists for state that arrives outside the request cycle. The deprecated `vue-demo-store` reference template uses it to apply a context pushed over a `BroadcastChannel` from another tab.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

`UpdateContextBody` is the honest description of what a context switch can change. Anything that is not a field on it cannot be switched through `PATCH /context` at all.

## Minimal Vue Example

<CodeExample title="Minimal session context panel">

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

const priceLabel = computed(() => {
  if (taxState.value === "gross") return "including tax";
  if (taxState.value === "net") return "excluding tax";
  return "tax free";
});

const switchCountry = async (id?: string) => {
  if (!id) return;

  contextError.value = "";
  isSwitching.value = true;

  try {
    await setCountry(id);
  } catch {
    contextError.value = "The country change could not be confirmed.";
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
      <dd>
        <ClientOnly>{{ currency?.isoCode }}</ClientOnly>
      </dd>

      <dt>Prices</dt>
      <dd>{{ priceLabel }}</dd>

      <dt>Shipping country</dt>
      <dd>{{ sessionContext.shippingLocation?.country?.name }}</dd>

      <dt>Shipping address</dt>
      <dd v-if="activeShippingAddress">
        {{ activeShippingAddress.street }}, {{ activeShippingAddress.city }}
      </dd>
      <dd v-else>not selected yet</dd>

      <dt>Customer</dt>
      <dd>
        <ClientOnly>{{ userFromContext?.email ?? "guest" }}</ClientOnly>
      </dd>
    </dl>

    <button
      type="button"
      :disabled="isSwitching || !countryId"
      @click="switchCountry(countryId)"
    >
      {{ isSwitching ? "Switching…" : "Re-apply the current country" }}
    </button>
  </div>
</template>
```

</CodeExample>

## State And Session

The Store API identifies the session with the `sw-context-token` header. The context is the server's view of that token, and the frontend never owns it — it only mirrors the last `GET /context` response.

That mirror lives in the `swSessionContext` injection provided by `useContext`. Passing a context into `useSessionContext(context)` writes it; calling `useSessionContext()` with no argument injects it. Provide and inject travel down the component tree, so the seeding call has to run in the root component, above every consumer.

`refreshSessionContext()` rethrows after logging. That matters for flows that must not continue on a half-applied switch, such as logout or the last checkout step — treat a rejection there as a blocking error rather than a warning.

The token itself is handled one layer below the composables. `@shopware/nuxt-module` seeds the API client with the `sw-context-token` cookie and writes every new token back to that cookie from the API client's `onContextChanged` hook, so a switch survives a reload. That write goes through `js-cookie` and is therefore browser-only: a token minted during a server render is never persisted. The API client also ignores a token that arrives on a publicly cacheable response (`Cache-Control: public`), because a CDN hit can otherwise replay a stored guest token over a logged-in session.

Server-side rendering is where the "seeded once at the root" story needs one more fact. The module passes the cookie token into the server-side API client only when `useUserContextInSSR` is enabled, and that option defaults to `false`:

```ts
// nuxt.config.ts
runtimeConfig: {
  public: {
    shopware: {
      useUserContextInSSR: true,
    },
  },
},
```

With the default, the root's `readContext get /context` runs without a token during the server render, so the HTML is built from a fresh anonymous context: no customer, and the sales channel defaults for currency, language and country. On the client the plugin does read the cookie, the root call runs again and replaces the shared value — a logged-in customer with a non-default currency sees the guest version of the page until hydration finishes.

That second run is the only thing that personalises the page, and it happens only if the seeding call is not payload-cached. Call `apiClient.invoke("readContext get /context")` directly, the way the starter template's `app.vue` does. Wrapped in `useAsyncData`, the server result travels in the Nuxt payload instead, the client never refetches, and the anonymous context stays for the whole session. Render anything derived from `userFromContext` or `currency` behind `<ClientOnly>`, as the Minimal Vue Example does, or turn the option on.

Turning it on moves the problem to the cache. The server render then depends on the visitor's session, so a route served from `isr` or from a shared CDN entry would hand one visitor's context to everyone. Enable it only together with `Cache-Control: private, no-store` (or `ssr: false`) on every route that renders context-dependent data; the starter template's `nuxt.config.ts` carries both halves of that trade-off as comments next to `routeRules`.

## Edge Cases

- `sessionContext` is `undefined` until the root seeds it. Guard on it before reading nested fields during the first render.
- `taxState` comes from `context.taxState` and is typed `string | undefined`, not a union of literals — the Store API constrains it nowhere. The cart's matching field, `price.taxStatus`, is documented as `gross`, `net` or `tax-free`, so a branch that reads "not gross" as net is a guess about a value the schema does not promise.
- Every formatted price on the page depends on `taxState` and `currency`, so a context switch invalidates cached price strings.
- `countryId` is the _shipping location_ country from `shippingLocation.country.id`, while `salesChannelCountryId` is the sales channel default. They differ as soon as the customer picks a different shipping country.
- `activeShippingAddress` falls back to `shippingLocation.address` when the customer has no active shipping address, but `activeBillingAddress` has no fallback and stays `null` for a guest.
- `currentLocaleCode` is read from `languageInfo.localeCode` on the context, so detecting the active locale needs no `readLanguages post /language` request.
- A currency or language switch changes prices and translated content. Anything already fetched — a listing, a cart summary, a product detail — is stale until it is refetched. The starter template's currency switcher awaits `setCurrency()`, then `useCart().refreshCart()`, and reloads the page, because nothing else re-runs the already-resolved data fetches.

## Common Mistakes

- Do not call `useSessionContext(context)` with an argument outside the application root. The argument overwrites the injected ref's value, which replaces the context for the whole application, not only for the subtree below the call.
- Do not send `updateContext patch /context` through `apiClient.invoke` and stop there. Without a following `refreshSessionContext()` the UI shows the old context.
- Do not treat `useInternationalization().changeLanguage()` as a context setter. It patches the context but leaves the shared value untouched on purpose.
- Do not use `setContext()` to apply a user-facing switch. It changes only local state and the server still has the previous context.
- Do not keep a local copy of the currency, the tax state or the active address.
- Do not read `taxState` once and cache the result. It is a `ComputedRef` for a reason.
- Do not treat a rejected `refreshSessionContext()` as recoverable in checkout or logout. The context may be partially applied.
- Do not enable `useUserContextInSSR` while context-dependent routes stay in a shared HTML cache. The option is global, so one visitor's server-rendered context would be served to the next.

## Testing Checklist

- The root seeds the context with `readContext get /context` before the first page renders.
- A second `useSessionContext()` call in a child component returns the same reactive context without issuing a request.
- `setCountry(id)` calls `updateContext patch /context` once and then `readContext get /context` once.
- After a successful switch, `countryId` and `sessionContext.shippingLocation.country` reflect the new country.
- A failing `PATCH /context` leaves the previously rendered context intact and surfaces a UI-level error.
- `setCurrency({})` without an id issues no request.
- `setShippingMethod({})` throws instead of issuing a request — its public signature takes a `Partial<>`, so the missing id is a runtime failure, not a compile error.
- `setPaymentMethod({})` is the opposite case and needs no test: that setter requires `{ id: string }`, so TypeScript rejects the call.
- `activeBillingAddress` is `null` for a guest session and set after login.
- With `useUserContextInSSR` left at its default, the server-rendered HTML of a logged-in visitor contains no customer data.

## Related Links

- [Languages documentation](../../getting-started/languages.html)
- [Login recipe](../account/login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Nuxt module package](../../packages/nuxt-module.html)
- [Prices documentation](../../getting-started/e-commerce/prices.html)
