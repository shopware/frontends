---
nav:
  position: 10
recipe:
  area: context
  status: stable
  frameworks:
    - vue
  composables:
    - useNavigationSearch
    - useNavigationContext
    - useCategorySearch
    - useLandingSearch
    - useUrlResolver
    - useBreadcrumbs
  helpers:
    - isTechnicalPath
    - normalizePath
    - getRouteFromPathInfo
    - getCanonicalPathForTechnicalPath
    - getProductRoute
    - getCategoryRoute
  operations:
    - readSeoUrl post /seo-url
    - readSeoUrlGet get /seo-url
    - readCategory post /category/{navigationId}
    - readCategoryGet get /category/{navigationId}
    - readLandingPage post /landing-page/{landingPageId}
  schemas:
    - SeoUrl
    - Category
    - LandingPage
    - SalesChannelContext
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Route",
    action: "Catch every path",
    detail:
      "A single catch-all route receives the path. The locale prefix is stripped before anything is resolved, so the API only ever sees the shop path.",
    code: "const routePath = route.path.slice(localeRootPath.length)",
    state: "route path",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Special-case the home page",
    detail:
      "resolvePath('/') sends no request. It synthesises a SeoUrl from the sales channel's navigationCategoryId on the session context.",
    code: "sessionContext.salesChannel.navigationCategoryId",
    state: "swSessionContext",
    typeKeys: ['Schemas["SalesChannelContext"]'],
  },
  {
    title: "Store API",
    action: "Look the path up",
    detail:
      "A SEO path is matched on seoPathInfo with the leading slash removed. A technical path like /detail/<id> is matched on pathInfo instead. With cacheableReads enabled the same filter travels as a _criteria query parameter on the GET route.",
    code: 'apiClient.invoke("readSeoUrl post /seo-url", { body: criteria })',
    state: "sw-context-token",
    typeKeys: ['operations["readSeoUrl post /seo-url"]["body"]'],
  },
  {
    title: "Composable",
    action: "Derive from the shape",
    detail:
      "With no match, getRouteFromPathInfo maps the three known technical prefixes to a route name and an id. Anything else resolves to null.",
    code: "getRouteFromPathInfo('/detail/abc') // frontend.detail.page",
    state: "synthetic SeoUrl",
    typeKeys: ['Schemas["SeoUrl"]'],
  },
  {
    title: "Route",
    action: "Redirect to the canonical URL",
    detail:
      "A technical path that resolved to a real SEO URL is redirected with a 301. The helper returns null for SEO paths and for synthetic fallbacks.",
    code: "navigateTo(canonicalPath, { redirectCode: 301, replace: true })",
    state: "the route changes",
    typeKeys: [],
  },
  {
    title: "Composable",
    action: "Provide the resolution",
    detail:
      "useNavigationContext(seoUrl) provides routeName and foreignKey. The route name pascal-cased is the page component to render.",
    code: "pascalCase(routeName) // FrontendNavigationPage",
    state: "navigation context",
    typeKeys: [],
  },
  {
    title: "Page",
    action: "Fetch the entity",
    detail:
      "The page component receives the foreign key and fetches the category or the landing page, with the CMS associations that a rendered page needs, and loads its own breadcrumbs.",
    code: "useCategorySearch().search(foreignKey, { withCmsAssociations: true })",
    state: "category or landing page",
    typeKeys: [
      'operations["readLandingPage post /landing-page/{landingPageId}"]["response"]',
    ],
  },
];
</script>

# URL Resolving and SEO URLs

## Goal

Serve every shop URL from one catch-all route: resolve the path to an entity, redirect technical URLs to their canonical SEO URL, and render the right page component. The important part is that the resolution is a `SeoUrl` lookup whose `routeName` decides the component, and that the home page is resolved without a request at all.

## Shopware Flow

`readSeoUrl post /seo-url` is an entity search over SEO URLs. `useNavigationSearch().resolvePath(path)` filters it on `seoPathInfo` for a normal path and on `pathInfo` for a technical one — `/navigation/<id>`, `/detail/<id>` or `/landingPage/<id>`.

Two paths never reach that request. `/` is answered from the session context, using the sales channel's `navigationCategoryId` and a hardcoded `frontend.navigation.page` route name. And when nothing matches, `getRouteFromPathInfo` derives a route name and an id from the technical prefix, producing a synthetic `SeoUrl` rather than a 404.

<RecipeFlowDiagram label="URL resolving flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The catch-all route receives the path and strips the locale prefix.
2. `resolvePath("/")` synthesises a resolution from `sessionContext.salesChannel.navigationCategoryId`.
3. Any other path is looked up over `/seo-url`, filtered on `seoPathInfo` or `pathInfo`.
4. With no match, `getRouteFromPathInfo` derives a resolution from the technical prefix, or returns `null`.
5. A technical path that mapped to a real SEO URL is redirected with a `301`.
6. `useNavigationContext(seoUrl)` provides `routeName` and `foreignKey`, and the pascal-cased route name is the page component.
7. That component fetches its entity from composables instead of keeping its own copy of the resolution.

You do not need one route per page type, and you do not fetch the entity in the catch-all. The `routeName` on the resolution is what selects the component, which is why `frontend.navigation.page` becomes `FrontendNavigationPage`.

## Request Flow

| Step                  | Code                                                            | Store API                            | Type                                                                                                      |
| --------------------- | --------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Resolve the home page | `resolvePath("/")`                                              | none                                 | <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />                                           |
| Resolve a SEO path    | `resolvePath("/my-category/my-product")`                        | `POST /seo-url`                      | <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["body"]' />                           |
| Read the resolution   | `routeName`, `foreignKey`                                       | `POST /seo-url`                      | <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />                       |
| Fetch a category page | `useCategorySearch().search(id, { withCmsAssociations: true })` | `POST /category/{navigationId}`      | <SchemaTypeTooltip type-key='operations["readCategory post /category/{navigationId}"]["body"]' />         |
| Fetch a landing page  | `useLandingSearch().search(id, { withCmsAssociations: true })`  | `POST /landing-page/{landingPageId}` | <SchemaTypeTooltip type-key='operations["readLandingPage post /landing-page/{landingPageId}"]["body"]' /> |

The methods in that column are the defaults. With `cacheableReads` enabled — `vue-starter-template` sets it under `runtimeConfig.public.shopware`, and `shopware: { cacheableReads: true }` is the equivalent module-option form — `resolvePath` and `useCategorySearch().search` call the GET variants instead, `readSeoUrlGet get /seo-url` and `readCategoryGet get /category/{navigationId}`, with the same criteria compressed into a `_criteria` query parameter. The filters, the fallback and the redirect are identical; only the transport changes. `useLandingSearch` has no GET branch and always posts. See [Caching](../../best-practices/caching.html) for what that buys you.

`useUrlResolver().resolveUrl` is not part of the resolution chain despite the name. It rewrites a CMS-authored internal link into a prefixed route and leaves everything else untouched.

## Composables

Pick by scope — how much of the resolution the composable is about:

| Composable             | Scope                       | Reach for it when                                                 |
| ---------------------- | --------------------------- | ----------------------------------------------------------------- |
| `useNavigationSearch`  | any path                    | turning a URL into a `SeoUrl`                                     |
| `useNavigationContext` | the resolved `SeoUrl`       | reading `routeName` or `foreignKey` anywhere below the route      |
| `useCategorySearch`    | one category, or a criteria | building the category page a `frontend.navigation.page` points at |
| `useLandingSearch`     | one landing page            | building the `frontend.landing.page` component                    |
| `useUrlResolver`       | one CMS link                | rendering author-written HTML that contains internal links        |
| `useBreadcrumbs`       | the global trail            | a page component that owns its own breadcrumbs                    |

`useNavigationSearch` is the one the recipe turns on, and it has a single entry point. `resolvePath(path)` returns `Promise<Schemas["SeoUrl"] | null>` and branches on the shape of the path:

- **`/`** — no request. Returns `{ routeName: "frontend.navigation.page", foreignKey: navigationCategoryId }` from the session context.
- **A SEO path** — one lookup filtered on `seoPathInfo`, with the leading slash removed.
- **A technical path** — one lookup filtered on `pathInfo`, with a trailing slash removed by `normalizePath`.
- **No match** — `getRouteFromPathInfo` derives a synthetic resolution from the technical prefix, otherwise `null`.

Seven things the generated reference will not tell you:

- `resolvePath("/")` issues no request at all, so it is only as correct as the session context. The id it returns changes with the sales channel, not with the route.
- `useNavigationContext(context)` snapshots what you pass it. `useContext` stores `ref(unref(context))`, so a `computed` handed to it is read once rather than tracked — which is what you want for a per-navigation resolution, and a trap if you expect it to follow a later change.
- `useNavigationContext` issues no requests. It provides the `navigation` injection and exposes `navigationContext`, `routeName` and `foreignKey`; `foreignKey` falls back to `""`, never `undefined`.
- `useCategorySearch` has two methods and they are not symmetrical. `search(categoryId, options)` sends `sw-include-seo-urls: true`; `advancedSearch({ query })` does not send that header at all.
- `useLandingSearch().search` passes `cmsAssociations.associations` as the `associations` body field, while `useCategorySearch().search` passes the whole `cmsAssociations` object. The two are not interchangeable if you build a request by hand.
- `useUrlResolver().resolveUrl(url)` does more than prefix: it drops the first path segment before re-joining, and it throws `URL Input too long` for input over 2083 characters. `getUrlPrefix()` reads an injected `urlPrefix` that the application provides, not the composable.
- `useBreadcrumbs` is scoped, not global. It goes through `useContext("swBreadcrumb")`, which injects an ancestor's ref or, finding none, creates its own and provides it downwards. Nothing above the page components provides it, so each page roots a fresh trail per mount and cannot inherit another page's. `clearBreadcrumbs()` empties the trail, and calling `useBreadcrumbs(breadcrumbs)` with an argument replaces it outright.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the resolution, the entity requests, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readSeoUrlGet get /seo-url"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readLandingPage post /landing-page/{landingPageId}"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />
  <SchemaTypeTooltip type-key='Schemas["Category"]' />
  <SchemaTypeTooltip type-key='Schemas["LandingPage"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type SeoUrlBody = operations["readSeoUrl post /seo-url"]["body"];
type SeoUrlResponse = operations["readSeoUrl post /seo-url"]["response"];
type CachedSeoUrlResponse = operations["readSeoUrlGet get /seo-url"]["response"];
type LandingPageBody =
  operations["readLandingPage post /landing-page/{landingPageId}"]["body"];
type SeoUrl = Schemas["SeoUrl"];
type LandingPage = Schemas["LandingPage"];
```

`SeoUrl` is the type the whole recipe turns on. `routeName` selects the page component, `foreignKey` is the entity id, and `seoPathInfo` and `pathInfo` are the two fields the lookup filters on.

## Minimal Vue Example

<CodeExample title="Minimal catch-all route">

```vue
<script setup lang="ts">
import {
  getCanonicalPathForTechnicalPath,
  isTechnicalPath,
} from "@shopware/helpers";
import { pascalCase } from "scule";

import type { Schemas } from "#shopware";

const { resolvePath } = useNavigationSearch();
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const localeRootPath = `/${locale.value}`;
const routePath =
  route.path === localeRootPath
    ? "/"
    : route.path.startsWith(`${localeRootPath}/`)
      ? route.path.slice(localeRootPath.length)
      : route.path;
const isTechnical = isTechnicalPath(routePath);

const { data: seoResult, error: resolveError } = await useAsyncData(
  `seo-url:${locale.value}:${routePath}`,
  async () => {
    if (import.meta.client && !isTechnical) {
      const { routeName: stateRouteName, foreignKey: stateForeignKey } =
        history.state ?? {};

      if (stateRouteName && stateForeignKey) {
        return {
          routeName: stateRouteName,
          foreignKey: stateForeignKey,
        } as Schemas["SeoUrl"];
      }
    }

    return await resolvePath(routePath);
  },
);

if (resolveError.value) {
  throw createError({
    statusCode: 503,
    statusMessage: `Could not resolve ${routePath}`,
    cause: resolveError.value,
    fatal: true,
  });
}

const canonicalPath = getCanonicalPathForTechnicalPath(
  routePath,
  seoResult.value,
);
const canonicalRedirectTarget = canonicalPath
  ? localePath({ path: canonicalPath, query: route.query })
  : null;

if (canonicalRedirectTarget) {
  await navigateTo(canonicalRedirectTarget, {
    redirectCode: 301,
    replace: true,
  });
}

if (!canonicalRedirectTarget && !seoResult.value?.foreignKey) {
  throw createError({
    statusCode: 404,
    statusMessage: `No data fetched from API for ${routePath}`,
  });
}

const { routeName, foreignKey } = useNavigationContext(
  ref(canonicalRedirectTarget ? null : seoResult.value),
);

const componentName = routeName.value ? pascalCase(routeName.value) : null;
const resolved = componentName ? resolveComponent(componentName) : null;
const pageComponent = resolved === componentName ? null : resolved;

if (!canonicalRedirectTarget && !pageComponent) {
  throw createError({
    statusCode: 404,
    statusMessage: `No page component for ${routePath}`,
  });
}
</script>

<template>
  <component
    :is="pageComponent"
    v-if="pageComponent"
    :navigation-id="foreignKey"
  />
</template>
```

</CodeExample>

Four things that route depends on and the code does not show:

- **The target components must be registered `global: true`.** `resolveComponent` resolves against the app's global component registry, not against Nuxt's compile-time auto-imports, so a `FrontendNavigationPage.vue` in plain `app/components/` is invisible to it. `vue-starter-template` registers `app/components/global` with `pathPrefix: false` and `global: true` in `nuxt.config.ts`.
- **The session context must already be seeded.** `resolvePath("/")` reads it instead of requesting anything, so the root has to await the context before this route renders. `vue-starter-template` does it in `app.vue`.
- **`navigateTo` does not halt `<script setup>`.** Everything after the redirect still runs, on the server and on the client, which is why every later step is gated on `!canonicalRedirectTarget`. An unguarded request or `throw` below it fires work against a response nobody will see — and at `301` a wrong answer is cached permanently.
- **The component is remounted per path.** Every derived value is a plain `const`, which is correct only because Nuxt's default page key changes with the route. A `keepalive` or a custom `page-key` freezes them on the first path resolved.

The page component receives only the `foreignKey`. It is the component's job to fetch the category or the landing page with `withCmsAssociations: true`, and to own its breadcrumbs — in `vue-starter-template`, `FrontendNavigationPage` and `FrontendDetailPage` call `clearBreadcrumbs()` before building their own trail, and `FrontendLandingPage` passes the CMS breadcrumbs to `useBreadcrumbs()`.

## State And Session

The resolution is provided, not fetched twice. `useNavigationContext(seoUrl)` writes the `navigation` injection, and every component below reads `routeName` and `foreignKey` from it without another lookup.

`resolvePath("/")` depends on the session context being loaded. It reads `sessionContext.salesChannel.navigationCategoryId`, so the home page cannot resolve before the root has seeded the context — and the id it returns changes with the sales channel, not with the route.

The lookup itself carries `sw-context-token` like any Store API call, but it changes nothing on the session. Whether it travels as a POST body or as a `_criteria` query parameter is decided once by `cacheableReads` in `nuxt.config.ts`, not per call.

`useUrlResolver().getUrlPrefix()` reads an injected `urlPrefix` with `""` as its default. Nothing in the composable provides it; the application does — `vue-starter-template` calls `provide("urlPrefix", prefix)` in `app.vue`, which is how the locale prefix reaches CMS components that render internal links.

## Edge Cases

- `resolvePath("/")` issues no request. Debugging a wrong home page means looking at the session context, not at the SEO URL table.
- A SEO path is filtered with the leading slash removed (`path.substring(1)`), a technical path with its trailing slash removed by `normalizePath`. Sending the wrong form matches nothing.
- With `cacheableReads: true` the lookup is `readSeoUrlGet get /seo-url`, so a network assertion or a proxy rule written against `POST /seo-url` sees nothing.
- `getRouteFromPathInfo` recognises exactly three prefixes: `/navigation/`, `/detail/` and `/landingPage/`. It returns `null` when the remainder is empty or contains another slash.
- The fallback resolution is synthetic: it has a `routeName` and a `foreignKey` and no `seoPathInfo`. `getCanonicalPathForTechnicalPath` returns `null` for it, so no redirect happens.
- `getCanonicalPathForTechnicalPath` also returns `null` for SEO paths and for a mapping whose target is itself technical. Only a genuine technical-to-SEO mapping produces a redirect.
- The redirect uses `301`. Getting the condition wrong caches the wrong target in browsers and CDNs.
- `routeName` is pascal-cased into a component name, and `resolveComponent` only finds components registered `global: true`. It returns the name string rather than throwing when nothing matches, which is why the example compares the result against the name and turns a miss into a `404`.
- `resolveUrl` throws `URL Input too long` for input over 2083 characters. That is a deliberate guard against a polynomial regular expression, not a validation error to surface.
- `resolveUrl` only rewrites URLs matching `[a-zA-Z0-9]+/navigation/[a-zA-Z0-9]+`, dropping the first path segment, and returns everything else unchanged. A `/detail/<id>` link is not rewritten.
- The breadcrumb trail is scoped to the subtree of whichever component calls `useBreadcrumbs` first. In `vue-starter-template` that is the page component, so each page starts from an empty trail and a page that builds none renders none.
- The `history.state` shortcut only fires for links built by `getProductRoute` or `getCategoryRoute`, which are what write `routeName` and `foreignKey` into the navigation state. A hand-written `<NuxtLink to="/my-category">` always takes the lookup.
- Nothing on this path carries a timeout. `resolvePath` takes no signal, so a Store API that accepts the connection and never answers hangs the render until the platform kills it. Set `runtimeConfig.apiClientConfig.timeout` if you want a bound.

## Common Mistakes

- Do not send the locale-prefixed path to `resolvePath`. Strip the prefix first.
- Do not expect a SEO URL row for the home page. It is synthesised.
- Do not treat a `null` resolution as a server error. It means nothing matched and no technical fallback applied.
- Do not redirect on every technical path. Check `getCanonicalPathForTechnicalPath` first — it returns `null` for synthetic fallbacks.
- Do not use a `302` for the canonical redirect. The helper's contract is a permanent mapping.
- Do not add one Nuxt route per page type. The `routeName` selects the component.
- Do not fetch the entity in the catch-all route. Pass the `foreignKey` down.
- Do not assume the lookup is a POST. Read `cacheableReads` before asserting on the request in a test or a cache rule.
- Do not surface `URL Input too long` to the customer. It is an internal guard.
- Do not rely on `resolveUrl` to prefix arbitrary links. It handles navigation links only.
- Do not let a failed lookup fall into the `404` branch. Read `error` from `useAsyncData` first and answer with a `5xx`, or a backend outage returns `404` for the whole catalogue and crawlers de-index it.
- Do not put the resolver's target components in plain `app/components/`. `resolveComponent` only sees a path registered `global: true`.
- Do not enter the `history.state` shortcut on `routeName` alone. Without a `foreignKey` it yields a resolution that fails the `404` guard on click but works on reload.

## Testing Checklist

- Opening `/` resolves to `frontend.navigation.page` without any `/seo-url` request.
- A SEO path issues one `/seo-url` lookup filtered on `seoPathInfo` without the leading slash.
- A technical path issues one `/seo-url` lookup filtered on `pathInfo`.
- The lookup uses the GET route when `cacheableReads` is enabled and the POST route when it is not.
- A technical path with a SEO mapping redirects once with a `301` to the canonical path.
- A technical path without a SEO mapping renders the page directly, with no redirect.
- An unknown path throws a 404 rather than rendering an empty component.
- A client-side link whose history state carries both `routeName` and `foreignKey` issues no lookup.
- A failing Store API answers with a `5xx`, not a `404`.
- The locale prefix is preserved in the redirect target and absent from the API request.
- A page component that sets no breadcrumbs does not inherit the previous page's trail.

## Related Links

- [Work with routing](../../guides/routing.html)
- [Build a navigation](../../guides/page-elements/navigation.html)
- [Content pages](../../guides/cms/content-pages.html)
- [Caching](../../best-practices/caching.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
