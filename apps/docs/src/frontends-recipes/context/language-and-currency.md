---
nav:
  position: 20
recipe:
  area: context
  status: stable
  frameworks:
    - vue
  composables:
    - useInternationalization
    - useSessionContext
    - useShopwareContext
    - useCart
  helpers:
    - getLanguageName
  operations:
    - readLanguages post /language
    - readLanguagesGet get /language
    - readCurrency post /currency
    - updateContext patch /context
    - changeLanguage post /account/change-language
  schemas:
    - Language
    - Currency
    - SalesChannelContext
---

<script setup>
import CodeExample from "../../components/CodeExample.vue";
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Composable",
    action: "Load the languages",
    detail:
      "getAvailableLanguages fills the shared swLanguages value. The id-to-code lookups read that value, so nothing that depends on them works before this resolves.",
    code: "await getAvailableLanguages()",
    state: "swLanguages",
    typeKeys: ['operations["readLanguages post /language"]["response"]'],
  },
  {
    title: "UI",
    action: "Pick a language",
    detail:
      "A switcher renders the shared list and compares each id with currentLanguageId from the context to mark the current one.",
    code: "changeLanguage(language.id)",
    state: "the select value",
    typeKeys: ['Schemas["Language"]'],
  },
  {
    title: "Store API",
    action: "Patch and maybe redirect",
    detail:
      "The context patch answers with a token header and an optional redirectUrl. The schema says outright: redirect if it is set. Once this resolves the context has already moved, whatever happens next.",
    code: "const { redirectUrl } = await changeLanguage(id)",
    state: "sw-context-token",
    typeKeys: ['operations["updateContext patch /context"]["response"]'],
  },
  {
    title: "Browser",
    action: "Reload the document",
    detail:
      "A language switch is a navigation, not a reactive update. The switcher follows redirectUrl through replaceToDevStorefront, or reloads the page.",
    code: "window.location.replace(replaceToDevStorefront(redirectUrl))",
    state: "the page unloads",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Switch the currency instead",
    detail:
      "The other branch, not a fifth stage. A currency switch is a context patch, not a navigation. setCurrency patches and refreshes the context - and every price already on the page is stale from that moment on.",
    code: "await setCurrency({ id })",
    state: "swSessionContext",
    typeKeys: ['Schemas["Currency"]'],
  },
];
</script>

# Language and Currency Switch

## Goal

Build a language switcher and a currency switcher. The important part is that they are not symmetrical: a language switch ends in a redirect or a full page reload, because the Store API answers it with a `redirectUrl`, while a currency switch is a plain context patch. The currency composable leaves you on the page — dealing with the prices that just went stale is then your job.

## Shopware Flow

Both switches end at `updateContext patch /context`. The difference is what the frontend does with the response. That response is a `ContextTokenResponse`: an `sw-context-token` header plus an optional `redirectUrl`, described in the schema as "Redirect if getRedirectUrl is set".

For a language that redirect is the point. A sales channel domain is bound to a language, so switching language means moving to a different domain or URL prefix — which no amount of reactivity can do. `useInternationalization().changeLanguage()` therefore returns the raw response and leaves the navigation to you, and it does **not** refresh the session context.

For a currency there is no domain involved. `useSessionContext().setCurrency()` patches the context and refreshes it, and the composable leaves the application where it is. In practice a switcher does more: `useCurrencySwitcher` in `vue-starter-template` follows `setCurrency()` with `refreshCart()` and then reloads the page, because nothing else re-renders the prices that are already on screen.

<RecipeFlowDiagram label="Language and currency flow diagram" :steps="steps" />

Steps 1 to 4 are the language flow in order. Step 5 is the currency branch, not a continuation — by step 4 the document has already unloaded.

1. `getAvailableLanguages()` fills the shared `swLanguages` value.
2. The switcher renders that list and marks the current language using `currentLanguageId` from the context.
3. `changeLanguage(id)` sends the context patch and returns `{ redirectUrl? }`.
4. The switcher navigates to `redirectUrl` — through `replaceToDevStorefront` — or reloads the page.
5. A currency switch instead calls `setCurrency({ id })`, which patches and refreshes the context in place and leaves you on the page.

`changeLanguage()` is the one switch that leaves the session context untouched. Following the redirect makes that moot, because the reload rebuilds everything — but if you stay on the page, call `refreshSessionContext()` yourself.

## Request Flow

| Step                        | Code                                                     | Store API                       | Type                                                                                                |
| --------------------------- | -------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| Load the languages          | `getAvailableLanguages()`                                | `POST /language`                | <SchemaTypeTooltip type-key='operations["readLanguages post /language"]["response"]' />             |
| Load the currencies         | `invoke("readCurrency post /currency")`                  | `POST /currency`                | <SchemaTypeTooltip type-key='operations["readCurrency post /currency"]["response"]' />              |
| Switch the language         | `changeLanguage(languageId)`                             | `PATCH /context`                | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["response"]' />             |
| Switch the currency         | `setCurrency({ id })`                                    | `PATCH /context`                | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />                 |
| Persist a customer language | `invoke("changeLanguage post /account/change-language")` | `POST /account/change-language` | <SchemaTypeTooltip type-key='operations["changeLanguage post /account/change-language"]["body"]' /> |

`readCurrency post /currency` has no composable wrapper, and its response is a bare array of currencies rather than an entity search result — the tooltip above is generated from a schema that still describes it as one, so trust the generated type. `changeLanguage post /account/change-language` has no wrapper either — it stores the language on the customer, which is a different thing from switching the current context.

The language list is one of the reads that [`cacheableReads`](../../best-practices/caching.html#request-layer-cacheablereads) moves off POST. With the flag enabled, `getAvailableLanguages()` calls `readLanguagesGet get /language` instead, and the response shape is unchanged. The context patch is a mutation and always stays `PATCH /context`.

## Composables

Pick by scope — which part of the context the composable is about:

| Composable                | Scope                         | Reach for it when                                      |
| ------------------------- | ----------------------------- | ------------------------------------------------------ |
| `useInternationalization` | languages and storefront URLs | building a language switcher, or formatting a link     |
| `useSessionContext`       | the whole session context     | reading the active language, or switching the currency |
| `useShopwareContext`      | the raw API client            | calling an operation that has no composable wrapper    |
| `useCart`                 | the cart                      | calling `refreshCart()` after a currency switch        |

`useInternationalization` is the one this recipe is built on:

- **Load** — `getAvailableLanguages()` fills the shared list every other member reads.
- **Read** — `languages`, `currentLanguage`, `currentPrefix`.
- **Switch** — `changeLanguage(id)` patches the context and hands back `{ redirectUrl? }`.
- **Resolve** — `getLanguageCodeFromId(id)`, `getLanguageIdFromCode(code)`, `replaceToDevStorefront(url)`, `formatLink(link)`, `getStorefrontUrl()`.

Four things the generated reference will not tell you:

- `changeLanguage()` is the odd one out. Every setter on `useSessionContext` — `setLanguage`, `setCurrency`, `setCountry` — calls `refreshSessionContext()` after its patch. This one does not, and it is the only one that hands you `redirectUrl` at all.
- `getLanguageCodeFromId` and `getLanguageIdFromCode` read the shared list directly, so they throw rather than returning `""` until `getAvailableLanguages()` has resolved.
- `formatLink` is a no-op unless the composable was created with a path resolver — `useInternationalization(localePath)`. Link components pass one; switchers do not.
- Read the active language from `useSessionContext().currentLanguageId`, not from this composable. `currentLanguage` is a writable ref that nothing in the composable ever sets.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the lists, the context patch, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readLanguages post /language"]["response"]' />
  <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["Language"]' />
  <SchemaTypeTooltip type-key='Schemas["Currency"]' />
</div>

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/context/language-and-currency/types.ts" code lang="ts" no-name -->

```ts
import type { Schemas, operations } from "#shopware";

type LanguagesResponse = operations["readLanguages post /language"]["response"];
type CurrenciesResponse = operations["readCurrency post /currency"]["response"];
type ContextPatchResponse =
  operations["updateContext patch /context"]["response"];
type Language = Schemas["Language"];
type Currency = Schemas["Currency"];
```

<!-- /automd -->

The two list responses do not share a shape, which is why they do not share a suffix: `LanguagesResponse` is an entity search result with an `elements` key, `CurrenciesResponse` is a bare `Currency[]`. And `ContextPatchResponse` is the type that explains the whole recipe: its only property is an optional `redirectUrl`.

## Minimal Vue Example

<CodeExample title="Minimal language and currency switcher">

<!-- automd:file src="examples/docs-code-examples/src/generated/frontends-recipes/context/language-and-currency/minimal-vue-example.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

const { apiClient } = useShopwareContext();
const {
  languages: storeLanguages,
  getAvailableLanguages,
  changeLanguage,
  replaceToDevStorefront,
} = useInternationalization();
const {
  sessionContext,
  refreshSessionContext,
  currentLanguageId,
  currency: currentCurrency,
  setCurrency,
} = useSessionContext();

const languagesQuery = useAsyncData("switcher-languages", () =>
  getAvailableLanguages(),
);
const currenciesQuery = useAsyncData("switcher-currencies", async () => {
  const { data } = await apiClient.invoke("readCurrency post /currency");
  return data;
});

await Promise.all([languagesQuery, currenciesQuery]);

// nothing fills the session context on its own - the Nuxt module only
// provides an empty ref, and both selects read their current value from it
if (!sessionContext.value) {
  await refreshSessionContext();
}

if (languagesQuery.data.value) {
  storeLanguages.value = languagesQuery.data.value.elements;
}

const currencies = currenciesQuery.data;

const loadError = computed(() => {
  if (languagesQuery.error.value && currenciesQuery.error.value)
    return "The language and currency options could not be loaded.";
  if (languagesQuery.error.value)
    return "The language options could not be loaded.";
  if (currenciesQuery.error.value)
    return "The currency options could not be loaded.";
  return "";
});

const isSwitchingContext = ref(false);
const contextSwitchError = ref("");

const switchLanguage = async (languageId: string) => {
  if (isSwitchingContext.value) return;
  if (!languageId || languageId === currentLanguageId.value) return;

  contextSwitchError.value = "";
  isSwitchingContext.value = true;

  let redirectUrl: string | undefined;

  try {
    ({ redirectUrl } = await changeLanguage(languageId));
  } catch (error) {
    console.error(error);
    contextSwitchError.value = "The language could not be changed.";
    isSwitchingContext.value = false;
    return;
  }

  try {
    if (redirectUrl) {
      window.location.replace(replaceToDevStorefront(redirectUrl));
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    contextSwitchError.value =
      "The language was changed, but this page could not redirect. Reload to continue.";
    isSwitchingContext.value = false;
  }
};

const switchCurrency = async (currencyId: string) => {
  if (isSwitchingContext.value) return;
  if (!currencyId || currencyId === currentCurrency.value?.id) return;

  contextSwitchError.value = "";
  isSwitchingContext.value = true;

  try {
    await setCurrency({ id: currencyId });

    if (currentCurrency.value?.id !== currencyId) {
      contextSwitchError.value = "The currency could not be changed.";
    }
  } catch (error) {
    console.error(error);
    // setCurrency patches and then refreshes; a throw can come from either
    // half, so this is unconfirmed rather than failed
    contextSwitchError.value =
      "The currency may have changed, but this page could not confirm it. Reload to see the current prices.";
  } finally {
    isSwitchingContext.value = false;
  }
};
</script>

<template>
  <p v-if="loadError" role="alert">{{ loadError }}</p>
  <p v-if="contextSwitchError" role="alert">{{ contextSwitchError }}</p>

  <label>
    Language
    <select
      :value="currentLanguageId"
      :aria-disabled="isSwitchingContext"
      :aria-busy="isSwitchingContext"
      @change="switchLanguage(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="language in storeLanguages ?? []"
        :key="language.id"
        :value="language.id"
      >
        {{ getLanguageName(language) }}
      </option>
    </select>
  </label>

  <label>
    Currency
    <select
      :value="currentCurrency?.id"
      :aria-disabled="isSwitchingContext"
      :aria-busy="isSwitchingContext"
      @change="switchCurrency(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="currency in currencies ?? []"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.translated?.name ?? currency.name }} ({{
          currency.isoCode
        }})
      </option>
    </select>
  </label>

  <p aria-live="polite">
    Prices are shown in
    {{ currentCurrency?.isoCode ?? "the default currency" }}.
  </p>
</template>
```

<!-- /automd -->

</CodeExample>

Three choices in this example look unusual and are deliberate. The patch and the navigation sit in **two** `try` blocks, because once `changeLanguage()` resolves the context has already moved: a throw after that point means the language changed and the page did not, and saying "the switch failed" would be a lie. The currency handler cannot split the same way — `setCurrency()` performs the patch and the refresh behind one call — so its `catch` says the switch is unconfirmed instead of failed. The selects carry `aria-disabled` rather than `disabled`, because a disabled control cannot hold focus and a keyboard user would be thrown to the top of the document — `aria-disabled` does not block activation, so each handler opens with its own `isSwitchingContext` guard. And the bindings are `:value` on the `<select>` rather than `:selected` on each `<option>`, because Vue force-syncs only the prop named `value`; with `:selected`, a failed switch leaves the control showing a pick the context never accepted.

The shared list is assigned from the query **result**, not from inside the handler. `getAvailableLanguages()` fills `swLanguages` as a side effect, but `useAsyncData` replays its payload instead of re-running the handler on the client, so that side effect never happens during hydration — the options would vanish the moment Vue takes over. `vue-starter-template` does the same thing at `app.vue:83` for the same reason.

The example owns its initial load, under keys of its own. `vue-starter-template` fetches the same two lists under `languages` and `storeCurrencies`, and borrowing those keys saves nothing: Nuxt binds the handler of whichever call registers the key first and ignores the second, then reports `NUXT_E3004` — "Incompatible options detected … different handler" — in dev. On the server the second call still aborts the first request and issues its own, so the fetch happens twice regardless; on the client neither call fetches, because hydration reads the SSR payload. Inside `vue-starter-template`, drop the example's two `useAsyncData` calls and the `refreshSessionContext()` guard — `app.vue` already fills both lists and the context — and read `languages` from `useInternationalization()`.

After a currency switch, anything already fetched — a listing, a cart summary, a product detail — still holds the old prices. `setCurrency()` refreshes the context and nothing else. `useCurrencySwitcher` in `vue-starter-template` handles this by calling `refreshCart()` and then reloading the page; refetching every affected request by hand is the alternative.

## State And Session

`useInternationalization` keeps three shared values through `useContext`: `swLanguages`, `swLanguagesCurrentLanguage` and `swLanguagesCurrentPrefix`. Only the first is written by the composable — `getAvailableLanguages()` fills it. `currentLanguage` and `currentPrefix` are plain writable refs that the composable never sets, and no template in this repository writes them either. Treat them as empty unless your own application code fills them.

The current language itself is read from the context, not from this composable. `useSessionContext().currentLanguageId` is the active language id — the first entry of the context's `languageIdChain`, or `""` — and `currentLocaleCode` its locale code, both taken from the last `GET /context`. The older `languageIdChain` getter returns the same computed and is deprecated.

`formatLink` only works when the composable was created with a path resolver — `useInternationalization(localePath)`. Without one it returns the link untouched, which is why link-formatting components pass the resolver and switchers do not.

## Edge Cases

- `changeLanguage()` does not refresh the session context. Either follow the redirect, or call `refreshSessionContext()` yourself.
- Once `changeLanguage()` resolves, the switch has happened server-side. A failure after that point — a throw from `replaceToDevStorefront`, a blocked navigation — is a failure to move the page, not a failure to switch.
- `getAvailableLanguages()` fills `swLanguages` as a side effect. Wrapping it in `useAsyncData` and relying on that side effect breaks on the client, because the handler is skipped in favour of the payload — assign the shared value from the query result instead.
- A `useAsyncData` key is not a dedupe mechanism. The first call to register a key owns the handler; a later call with the same key and a different function silently gets the first one's data, and dev logs `NUXT_E3004`. On the server the second call aborts the first request and runs the same handler again, so nothing is saved. Share a fetch by sharing a composable, not by reusing its key.
- Nothing loads the session context for you. `@shopware/nuxt-module` provides an empty `swSessionContext` ref and no more; only `refreshSessionContext()` — directly, or through a setter that calls it — ever fills it. Until then `currentLanguageId` is `""` and `currency` is `null`, so a switcher renders with neither option marked.
- `getLanguageCodeFromId` and `getLanguageIdFromCode` read the shared `swLanguages` value, which starts as `undefined`. Calling either before `getAvailableLanguages()` has resolved throws rather than returning an empty string.
- Both lookups return `""` when the id or code is not in the list. An empty string passed on as a language id produces a request the API rejects.
- The language label is `translationCode.translated.name`, which `getLanguageName` reads. `language.name` is the internal name and is not what a customer should see.
- `replaceToDevStorefront(url)` swaps the origin of an absolute URL for `devStorefrontUrl` when that is configured. Skipping it in development sends the customer to the production domain the backend returned. It parses the argument with `new URL(url)`, so a relative path throws rather than passing through.
- `redirectUrl` is optional. A sales channel with a single domain returns none, and a reload is the only way to re-render everything in the new language.
- `vue-starter-template` applies `sw-language-id` as an API client default header in `app.vue`, where it reconciles the URL prefix with the session language and then stays on the page. A switcher that navigates does not need it: `changeLanguage()` carries `languageId` in the body, and the document unloads anyway. Headers are resolved per `invoke` call, so requests already in flight keep the previous language.
- A rejection from `setCurrency()` is ambiguous. It patches the context and then calls `refreshSessionContext()`, which rethrows, so the throw can mean the patch failed or that it succeeded and only the follow-up `GET /context` did. In the second case the server is already on the new currency while the local context is not, and `currency` still reports the old one. Report it as unconfirmed, and call `refreshSessionContext()` again — or run the patch through `apiClient.invoke` yourself if you need to tell the two apart.
- A currency switch leaves every fetched price stale. Nothing in `useSessionContext` refetches listings or carts.
- `readCurrency post /currency` returns a plain array. There is no `elements` key to unwrap, unlike `readLanguages post /language`.
- `changeLanguage post /account/change-language` takes `{ languageId }`, required, and the backend expects a 32-character hex id. Store API schemas before 6.7.13 named the property `language` while marking `languageId` required, and the tooltip above is rendered from a 6.7.10 snapshot, so it can still show `language`. The generated types you compile against are the ones to trust.
- `setLanguage()` on `useSessionContext` returns silently when the language has no `id`, and unlike `changeLanguage()` it refreshes the context — but it ignores `redirectUrl` entirely.
- `setCurrency()` also returns silently — it logs and stops when the argument has no `id` — so a failed switch is not always a rejected promise. Compare `currency` against the id you asked for instead of trusting the resolved promise.
- With `cacheableReads` enabled, the language list is fetched over `readLanguagesGet get /language`. Assertions and mocks written against `POST /language` do not match a storefront that has the flag on.

## Common Mistakes

- Do not treat a language switch as a reactive update. Follow the redirect or reload.
- Do not use `changeLanguage()` and skip both the redirect and a context refresh.
- Do not wrap the patch and the navigation in one `try`. A throw after `changeLanguage()` resolves is not a failed switch, and reporting it as one leaves the customer with a shop that changes language on their next click.
- Do not bind `:selected` on `<option>`. Bind `:value` on the `<select>`, or a failed switch leaves the control showing a value the context never accepted.
- Do not reuse another component's `useAsyncData` key to avoid a second request. Your handler will not run, and the server fetches twice anyway.
- Do not read `currentLanguageId` or `currency` without making sure something loaded the context first.
- Do not call the id-to-code lookups before the language list has loaded.
- Do not render `language.name` in a switcher. Use `getLanguageName`.
- Do not skip `replaceToDevStorefront` on the returned `redirectUrl`.
- Do not expect `readCurrency post /currency` to have an `elements` key.
- Do not report a rejected `setCurrency()` as "the currency could not be changed". The patch may have gone through and only the refresh failed.
- Do not leave listings and carts unrefetched after a currency switch.
- Do not confuse `changeLanguage post /account/change-language` with a context switch. It stores a preference on the customer.
- Do not assume `currentLanguage` and `currentPrefix` are populated. The composable does not write them.
- Do not reach for `languageIdChain` in new code. It is the deprecated name of `currentLanguageId`.

## Testing Checklist

- The language list loads once and fills the shared `languages` value.
- The switcher marks the language whose id equals `currentLanguageId`.
- A response with a `redirectUrl` navigates there, with the dev storefront origin substituted when configured.
- A response without a `redirectUrl` reloads the page.
- A throw raised after the patch resolved reports that the language changed but the page did not move, and does not claim the switch failed.
- A failing list load renders a message rather than two empty dropdowns.
- Switching the currency calls `updateContext patch /context` and then `readContext get /context`.
- After a currency switch, `currency.isoCode` on the context reflects the new currency without a page reload.
- A `setCurrency()` call that resolves without changing the currency still surfaces an error.
- Refetching a listing after a currency switch returns different price values.
- A failing language patch shows a UI-level error and leaves the current language in place.
- A `setCurrency()` that rejects because the context refresh failed reports an unconfirmed switch, not a failed one.
- Mounted in an application that has not loaded the context, the switcher still marks the active language and currency.
- Selecting the language or currency that is already active sends no request.
- With `cacheableReads` enabled, the language list is requested over `GET /language`.

## Related Links

- [URL Resolving and SEO URLs recipe](url-resolving.html)
- [Navigation and Breadcrumbs recipe](navigation.html)
- [Session Context recipe](session-context.html)
- [Prices and Tax State recipe](../catalog/prices.html)
- [Product Listing and Filters recipe](../catalog/listing.html)
- [Search and Suggest recipe](../catalog/search.html)
- [Cart recipe](../checkout/cart.html)
- [Work with languages](../../guides/languages.html)
- [Storefront URL guide](../../guides/storefront-url.html)
- [Prices documentation](../../guides/e-commerce/prices.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
