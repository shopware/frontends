---
nav:
  position: 40
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
    - getRouteFromPathInfo
    - getCanonicalPathForTechnicalPath
    - buildUrlPrefix
  operations:
    - readSeoUrl post /seo-url
    - readCategory post /category/{navigationId}
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
      "A SEO path is matched on seoPathInfo with the leading slash removed. A technical path like /detail/<id> is matched on pathInfo instead.",
    code: 'apiClient.invoke("readSeoUrl post /seo-url", { body: { filter } })',
    state: "sw-context-token",
    typeKeys: ['operations["readSeoUrl post /seo-url"]["body"]'],
  },
  {
    title: "Fallback",
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
    title: "Context",
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
      "The page component receives the foreign key and fetches the category or the landing page, with the CMS associations that a rendered page needs.",
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
3. Any other path is looked up with `readSeoUrl post /seo-url`, filtered on `seoPathInfo` or `pathInfo`.
4. With no match, `getRouteFromPathInfo` derives a resolution from the technical prefix, or returns `null`.
5. A technical path that mapped to a real SEO URL is redirected with a `301`.
6. `useNavigationContext(seoUrl)` provides `routeName` and `foreignKey`, and the pascal-cased route name is the page component.
7. That component fetches its entity with `useCategorySearch` or `useLandingSearch`.

You do not need one route per page type. The `routeName` on the resolution is what selects the component, which is why `frontend.navigation.page` becomes `FrontendNavigationPage`.

## Request Flow

| Step                    | Code                                                            | Store API                            | Type                                                                                                      |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Resolve the home page   | `resolvePath("/")`                                              | none                                 | <SchemaTypeTooltip type-key='Schemas["SalesChannelContext"]' />                                           |
| Resolve a SEO path      | `resolvePath("/my-category/my-product")`                        | `POST /seo-url`                      | <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["body"]' />                           |
| Read the resolution     | `routeName`, `foreignKey`                                       | `POST /seo-url`                      | <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />                       |
| Fetch a category page   | `useCategorySearch().search(id, { withCmsAssociations: true })` | `POST /category/{navigationId}`      | <SchemaTypeTooltip type-key='operations["readCategory post /category/{navigationId}"]["body"]' />         |
| Fetch a landing page    | `useLandingSearch().search(id, { withCmsAssociations: true })`  | `POST /landing-page/{landingPageId}` | <SchemaTypeTooltip type-key='operations["readLandingPage post /landing-page/{landingPageId}"]["body"]' /> |
| Prefix an internal link | `resolveUrl(url)`                                               | none                                 | <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />                                                        |

`useUrlResolver().resolveUrl` is not part of the resolution chain despite the name. It rewrites a CMS-authored internal link into a prefixed route and leaves everything else untouched.

## Composables

- `useNavigationSearch`: the resolver. `resolvePath(path)` returns a `SeoUrl` or `null`, handling the home page, SEO paths, technical paths and the synthetic fallback.
- `useNavigationContext`: holds the resolution. `useNavigationContext(seoUrl)` provides it and exposes `navigationContext`, `routeName` and `foreignKey`. It issues no requests.
- `useCategorySearch`: `search(categoryId, options)` for a category page and `advancedSearch({ query })` for a criteria-based lookup. Both send `sw-include-seo-urls: true`.
- `useLandingSearch`: `search(landingPageId, options)` for a landing page.
- `useUrlResolver`: `getUrlPrefix()` returns the injected `urlPrefix`, and `resolveUrl(url)` prefixes a technical navigation link.

## Types

Use generated Store API types when you need to type the resolution, the entity requests, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readLandingPage post /landing-page/{landingPageId}"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />
  <SchemaTypeTooltip type-key='Schemas["Category"]' />
  <SchemaTypeTooltip type-key='Schemas["LandingPage"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type SeoUrlBody = operations["readSeoUrl post /seo-url"]["body"];
type SeoUrlResponse = operations["readSeoUrl post /seo-url"]["response"];
type LandingPageBody =
  operations["readLandingPage post /landing-page/{landingPageId}"]["body"];
type SeoUrl = Schemas["SeoUrl"];
type LandingPage = Schemas["LandingPage"];
```

`SeoUrl` is the type the whole recipe turns on. `routeName` selects the page component, `foreignKey` is the entity id, and `seoPathInfo` and `pathInfo` are the two fields the lookup filters on.

## Minimal Vue Example

```vue
<script setup lang="ts">
import {
  getCanonicalPathForTechnicalPath,
  isTechnicalPath,
} from "@shopware/helpers";
import { pascalCase } from "scule";

import type { Schemas } from "#shopware";

const { resolvePath } = useNavigationSearch();
const { clearBreadcrumbs } = useBreadcrumbs();
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

// the API only ever sees the shop path, never the locale prefix
const localeRoot = `/${locale.value}`;
const shopPath =
  route.path === localeRoot
    ? "/"
    : route.path.startsWith(`${localeRoot}/`)
    ? route.path.slice(localeRoot.length)
    : route.path;

const { data: resolution } = await useAsyncData(
  `resolve${shopPath}`,
  async () => {
    // a client-side link already carries the resolution in the history state
    if (import.meta.client && !isTechnicalPath(shopPath)) {
      if (history.state?.routeName) {
        return {
          routeName: history.state.routeName,
          foreignKey: history.state.foreignKey,
        } as Schemas["SeoUrl"];
      }
    }

    return await resolvePath(shopPath);
  }
);

// a technical path that mapped to a real SEO URL gets a permanent redirect
const canonicalPath = getCanonicalPathForTechnicalPath(
  shopPath,
  resolution.value
);

if (canonicalPath) {
  await navigateTo(localePath({ path: canonicalPath, query: route.query }), {
    redirectCode: 301,
    replace: true,
  });
}

if (!canonicalPath && !resolution.value?.foreignKey) {
  throw createError({
    statusCode: 404,
    statusMessage: `Nothing resolves for ${shopPath}`,
  });
}

const { routeName, foreignKey } = useNavigationContext(
  computed(() => (canonicalPath ? null : resolution.value))
);

// frontend.navigation.page becomes FrontendNavigationPage
const pageComponent = computed(() => {
  const name = pascalCase(routeName.value ?? "errors/RoutingNotFound");
  const component = resolveComponent(name);
  return component === name ? null : component;
});

// the trail is global, so a page that sets none must not inherit one
onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});
</script>

<template>
  <template v-if="!canonicalPath">
    <component
      :is="pageComponent"
      v-if="pageComponent"
      :navigation-id="foreignKey"
    />
    <p v-else>No page component for {{ routeName }}.</p>
  </template>
</template>
```

The page component receives only the `foreignKey`. It is the component's job to fetch the category or the landing page with `withCmsAssociations: true`, and to load its own breadcrumbs.

## State And Session

The resolution is provided, not fetched twice. `useNavigationContext(seoUrl)` writes the `navigation` injection, and every component below reads `routeName` and `foreignKey` from it without another lookup.

`resolvePath("/")` depends on the session context being loaded. It reads `sessionContext.salesChannel.navigationCategoryId`, so the home page cannot resolve before the root has seeded the context — and the id it returns changes with the sales channel, not with the route.

`useUrlResolver().getUrlPrefix()` reads an injected `urlPrefix` with `""` as its default. Nothing in the composable provides it; the application does, which is how the locale prefix reaches CMS components that render internal links.

## Edge Cases

- `resolvePath("/")` issues no request. Debugging a wrong home page means looking at the session context, not at the SEO URL table.
- A SEO path is filtered with the leading slash removed (`path.substring(1)`), a technical path with its trailing slash removed by `normalizePath`. Sending the wrong form matches nothing.
- `getRouteFromPathInfo` recognises exactly three prefixes: `/navigation/`, `/detail/` and `/landingPage/`. It returns `null` when the remainder is empty or contains another slash.
- The fallback resolution is synthetic: it has a `routeName` and a `foreignKey` and no `seoPathInfo`. `getCanonicalPathForTechnicalPath` returns `null` for it, so no redirect happens.
- `getCanonicalPathForTechnicalPath` also returns `null` for SEO paths and for a mapping whose target is itself technical. Only a genuine technical-to-SEO mapping produces a redirect.
- The redirect uses `301`. Getting the condition wrong caches the wrong target in browsers and CDNs.
- `routeName` is pascal-cased into a component name. A `routeName` with no matching component renders nothing, and `resolveComponent` returns the name string rather than throwing.
- `resolveUrl` throws `URL Input too long` for input over 2083 characters. That is a deliberate guard against a polynomial regular expression, not a validation error to surface.
- `resolveUrl` only rewrites URLs matching `[a-zA-Z0-9]+/navigation/[a-zA-Z0-9]+` and returns everything else unchanged. A `/detail/<id>` link is not rewritten.
- `useLandingSearch` passes `cmsAssociations.associations` as the `associations` body field, while `useCategorySearch` passes the whole `cmsAssociations` object as `associations`. The two are not interchangeable if you build a request by hand.
- The breadcrumb trail is global and survives a route change. The catch-all clears it in `onBeforeRouteLeave` for exactly that reason.

## Common Mistakes

- Do not send the locale-prefixed path to `resolvePath`. Strip the prefix first.
- Do not expect a SEO URL row for the home page. It is synthesised.
- Do not treat a `null` resolution as a server error. It means nothing matched and no technical fallback applied.
- Do not redirect on every technical path. Check `getCanonicalPathForTechnicalPath` first — it returns `null` for synthetic fallbacks.
- Do not use a `302` for the canonical redirect. The helper's contract is a permanent mapping.
- Do not add one Nuxt route per page type. The `routeName` selects the component.
- Do not fetch the entity in the catch-all route. Pass the `foreignKey` down.
- Do not surface `URL Input too long` to the customer. It is an internal guard.
- Do not rely on `resolveUrl` to prefix arbitrary links. It handles navigation links only.

## Testing Checklist

- Opening `/` resolves without a `readSeoUrl post /seo-url` request and yields `frontend.navigation.page`.
- A SEO path issues one lookup filtered on `seoPathInfo` without the leading slash.
- A technical path issues one lookup filtered on `pathInfo`.
- A technical path with a SEO mapping redirects once with a `301` to the canonical path.
- A technical path without a SEO mapping renders the page directly, with no redirect.
- An unknown path throws a 404 rather than rendering an empty component.
- A client-side link with a resolution in the history state issues no lookup.
- The locale prefix is preserved in the redirect target and absent from the API request.
- Leaving a page clears the breadcrumb trail.

## Related Links

- [Routing](../../getting-started/routing.html)
- [Navigation page element](../../getting-started/page-elements/navigation.html)
- [Content pages](../../getting-started/cms/content-pages.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
