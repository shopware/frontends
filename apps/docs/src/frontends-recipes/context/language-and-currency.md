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
    - useCountries
  helpers:
    - getLanguageName
  operations:
    - readLanguages post /language
    - readCurrency post /currency
    - readCountry post /country
    - updateContext patch /context
    - changeLanguage post /account/change-language
  schemas:
    - Language
    - Currency
    - Country
    - SalesChannelContext
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Root",
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
      "A switcher renders the shared list and compares each id with languageIdChain from the context to mark the current one.",
    code: "changeLanguage(language.id)",
    state: "local select state",
    typeKeys: ['Schemas["Language"]'],
  },
  {
    title: "Client",
    action: "Set the request header",
    detail:
      "The application applies sw-language-id as a default header before switching, so every following request is made in the new language.",
    code: 'apiClient.defaultHeaders.apply({ "sw-language-id": id })',
    state: "default headers",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Patch and maybe redirect",
    detail:
      "The context patch answers with a token header and an optional redirectUrl. The schema says outright: redirect if it is set.",
    code: "const data = await changeLanguage(id)",
    state: "sw-context-token",
    typeKeys: ['operations["updateContext patch /context"]["response"]'],
  },
  {
    title: "Browser",
    action: "Reload the document",
    detail:
      "A language switch is a navigation, not a reactive update. The switcher follows redirectUrl through replaceToDevStorefront, or reloads the page.",
    code: "window.location.replace(replaceToDevStorefront(data.redirectUrl))",
    state: "the page unloads",
    typeKeys: [],
  },
  {
    title: "Currency",
    action: "Patch and refresh",
    detail:
      "A currency switch stays in the SPA. setCurrency patches the context and refreshes it, and every already-fetched price is then stale.",
    code: "await setCurrency({ id })",
    state: "swSessionContext",
    typeKeys: ['Schemas["Currency"]'],
  },
];
</script>

# Language and Currency Switch

## Goal

Build a language switcher and a currency switcher. The important part is that they are not symmetrical: a currency switch is a context patch you stay on the page for, while a language switch ends in a redirect or a full page reload, because the Store API answers it with a `redirectUrl`.

## Shopware Flow

Both switches end at `updateContext patch /context`. The difference is what the frontend does with the response. That response is a `ContextTokenResponse`: an `sw-context-token` header plus an optional `redirectUrl`, described in the schema as "Redirect if getRedirectUrl is set".

For a language that redirect is the point. A sales channel domain is bound to a language, so switching language means moving to a different domain or URL prefix — which no amount of reactivity can do. `useInternationalization().changeLanguage()` therefore returns the raw response and leaves the navigation to you, and it does **not** refresh the session context.

For a currency there is no domain involved. `useSessionContext().setCurrency()` patches the context and refreshes it, and the application stays where it is.

<RecipeFlowDiagram label="Language and currency flow diagram" :steps="steps" />

Read the diagram from left to right:

1. `getAvailableLanguages()` fills the shared `swLanguages` value.
2. The switcher renders that list and marks the current language using `languageIdChain` from the context.
3. Before switching, the application applies `sw-language-id` as an API client default header.
4. `changeLanguage(id)` sends the context patch and returns `{ redirectUrl? }`.
5. The switcher navigates to `redirectUrl` — through `replaceToDevStorefront` — or reloads the page.
6. A currency switch instead calls `setCurrency({ id })`, which patches and refreshes the context in place.

You do need to refresh the context yourself after `changeLanguage()`. Unlike every setter on `useSessionContext`, it issues the patch and stops there.

## Request Flow

| Step                        | Code                                                     | Store API                       | Type                                                                                                |
| --------------------------- | -------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| Load the languages          | `getAvailableLanguages()`                                | `POST /language`                | <SchemaTypeTooltip type-key='operations["readLanguages post /language"]["response"]' />             |
| Load the currencies         | `invoke("readCurrency post /currency")`                  | `POST /currency`                | <SchemaTypeTooltip type-key='operations["readCurrency post /currency"]["response"]' />              |
| Load the countries          | `fetchCountries()`                                       | `POST /country`                 | <SchemaTypeTooltip type-key='operations["readCountry post /country"]["response"]' />                |
| Switch the language         | `changeLanguage(languageId)`                             | `PATCH /context`                | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["response"]' />             |
| Switch the currency         | `setCurrency({ id })`                                    | `PATCH /context`                | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />                 |
| Switch the country          | `setCountry(countryId)`                                  | `PATCH /context`                | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' />                 |
| Persist a customer language | `invoke("changeLanguage post /account/change-language")` | `POST /account/change-language` | <SchemaTypeTooltip type-key='operations["changeLanguage post /account/change-language"]["body"]' /> |

`readCurrency post /currency` has no composable wrapper, and its response is a bare array of currencies rather than an entity search result. `changeLanguage post /account/change-language` has none either — it stores the language on the customer, which is a different thing from switching the current context.

## Composables

- `useInternationalization`: the language side. Reads `languages`, `currentLanguage`, `currentPrefix`. Acts with `getAvailableLanguages()`, `changeLanguage(id)`, `getLanguageCodeFromId(id)`, `getLanguageIdFromCode(code)`, `replaceToDevStorefront(url)`, `formatLink(link)` and `getStorefrontUrl()`.
- `useSessionContext`: the currency and country side, and the source of `languageIdChain`, `currentLocaleCode` and `currency`. Its `setLanguage`, `setCurrency` and `setCountry` all refresh the context afterwards.
- `useCountries`: the country list, with `getCountries`, `getCountriesOptions` and `fetchCountries()`. It fetches on mount, so a country select needs no explicit load.

## Types

Use generated Store API types when you need to type the lists, the context patch, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readLanguages post /language"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readCurrency post /currency"]["response"]' />
  <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["Language"]' />
  <SchemaTypeTooltip type-key='Schemas["Currency"]' />
  <SchemaTypeTooltip type-key='Schemas["Country"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type LanguageList = operations["readLanguages post /language"]["response"];
type CurrencyList = operations["readCurrency post /currency"]["response"];
type ContextPatchResult =
  operations["updateContext patch /context"]["response"];
type Language = Schemas["Language"];
type Currency = Schemas["Currency"];
```

`ContextPatchResult` is the type that explains the whole recipe: its only property is an optional `redirectUrl`.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const {
  languages,
  getAvailableLanguages,
  changeLanguage,
  replaceToDevStorefront,
} = useInternationalization();
const { languageIdChain, currency, setCurrency } = useSessionContext();

const currencies = ref<Schemas["Currency"][]>([]);
const isSwitching = ref(false);
const switchError = ref("");

onMounted(async () => {
  const [, currencyResult] = await Promise.all([
    getAvailableLanguages(),
    apiClient.invoke("readCurrency post /currency"),
  ]);
  // the currency list comes back as a bare array
  currencies.value = currencyResult.data;
});

const switchLanguage = async (languageId: string) => {
  switchError.value = "";
  isSwitching.value = true;

  try {
    // subsequent requests have to be made in the new language
    apiClient.defaultHeaders.apply({ "sw-language-id": languageId });

    const result = await changeLanguage(languageId);

    // a language switch is a navigation, not a reactive update
    if (result.redirectUrl) {
      window.location.replace(replaceToDevStorefront(result.redirectUrl));
    } else {
      window.location.reload();
    }
  } catch {
    switchError.value = "The language could not be changed.";
    isSwitching.value = false;
  }
};

const switchCurrency = async (currencyId: string) => {
  switchError.value = "";
  isSwitching.value = true;

  try {
    // setCurrency patches and refreshes the context, so the app stays put
    await setCurrency({ id: currencyId });
  } catch {
    switchError.value = "The currency could not be changed.";
  } finally {
    isSwitching.value = false;
  }
};
</script>

<template>
  <p v-if="switchError">{{ switchError }}</p>

  <label>
    Language
    <select
      :disabled="isSwitching || !languages?.length"
      @change="switchLanguage(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="language in languages ?? []"
        :key="language.id"
        :value="language.id"
        :selected="languageIdChain === language.id"
      >
        {{ getLanguageName(language) }}
      </option>
    </select>
  </label>

  <label>
    Currency
    <select
      :disabled="isSwitching || !currencies.length"
      @change="switchCurrency(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in currencies"
        :key="option.id"
        :value="option.id"
        :selected="currency?.id === option.id"
      >
        {{ option.translated?.name ?? option.name }} ({{ option.isoCode }})
      </option>
    </select>
  </label>
</template>
```

After a currency switch, anything already fetched — a listing, a cart summary, a product detail — still holds the old prices. Refetch it, or navigate.

## State And Session

`useInternationalization` keeps three shared values through `useContext`: `swLanguages`, `swLanguagesCurrentLanguage` and `swLanguagesCurrentPrefix`. Only the first is written by the composable — `getAvailableLanguages()` fills it. `currentLanguage` and `currentPrefix` are plain writable refs that the composable never sets, so whatever fills them is application code, typically the i18n layer of the template.

The current language itself is read from the context, not from this composable. `useSessionContext().languageIdChain` is the active language id and `currentLocaleCode` its locale code, both taken from the last `GET /context`.

`formatLink` only works when the composable was created with a path resolver — `useInternationalization(localePath)`. Without one it returns the link untouched, which is why link-formatting components pass the resolver and switchers do not.

## Edge Cases

- `changeLanguage()` does not refresh the session context. Either follow the redirect, or call `refreshSessionContext()` yourself.
- `getLanguageCodeFromId` and `getLanguageIdFromCode` read the shared `swLanguages` value, which starts as `undefined`. Calling either before `getAvailableLanguages()` has resolved throws rather than returning an empty string.
- Both lookups return `""` when the id or code is not in the list. An empty string passed on as a language id produces a request the API rejects.
- The language label is `translationCode.translated.name`, which `getLanguageName` reads. `language.name` is the internal name and is not what a customer should see.
- `replaceToDevStorefront(url)` swaps the origin of an absolute URL for `devStorefrontUrl` when that is configured. Skipping it in development sends the customer to the production domain the backend returned.
- `redirectUrl` is optional. A sales channel with a single domain returns none, and a reload is the only way to re-render everything in the new language.
- Applying `sw-language-id` as a default header affects every subsequent request from that client instance, including ones already in flight elsewhere on the page.
- A currency switch leaves every fetched price stale. Nothing in `useSessionContext` refetches listings or carts.
- `readCurrency post /currency` returns a plain array. There is no `elements` key to unwrap, unlike `readLanguages post /language`.
- `changeLanguage post /account/change-language` declares `languageId` as required but the only property in its body schema is `language`. Verify the field name against your Shopware version before relying on it.
- `setLanguage()` on `useSessionContext` returns silently when the language has no `id`, and unlike `changeLanguage()` it refreshes the context — but it ignores `redirectUrl` entirely.

## Common Mistakes

- Do not treat a language switch as a reactive update. Follow the redirect or reload.
- Do not use `changeLanguage()` and skip both the redirect and a context refresh.
- Do not call the id-to-code lookups before the language list has loaded.
- Do not render `language.name` in a switcher. Use `getLanguageName`.
- Do not skip `replaceToDevStorefront` on the returned `redirectUrl`.
- Do not expect `readCurrency post /currency` to have an `elements` key.
- Do not leave listings and carts unrefetched after a currency switch.
- Do not confuse `changeLanguage post /account/change-language` with a context switch. It stores a preference on the customer.
- Do not assume `currentLanguage` and `currentPrefix` are populated. The composable does not write them.

## Testing Checklist

- The language list loads once and fills the shared `languages` value.
- The switcher marks the language whose id equals `languageIdChain`.
- Switching applies `sw-language-id` as a default header before the patch is sent.
- A response with a `redirectUrl` navigates there, with the dev storefront origin substituted when configured.
- A response without a `redirectUrl` reloads the page.
- Switching the currency calls `updateContext patch /context` and then `readContext get /context`.
- After a currency switch, `currency.isoCode` on the context reflects the new currency without a page reload.
- Refetching a listing after a currency switch returns different price values.
- A failing switch shows a UI-level error and leaves the current language and currency in place.

## Related Links

- [Languages documentation](../../getting-started/languages.html)
- [Storefront URL guide](../../guides/storefront-url.html)
- [Prices documentation](../../getting-started/e-commerce/prices.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
