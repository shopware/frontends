---
nav:
  position: 10
recipe:
  area: context
  status: stable
  frameworks:
    - vue
  composables:
    - useNavigation
    - useNavigationSearch
    - useNavigationContext
    - useBreadcrumbs
    - useCategory
    - useCategorySearch
    - useShopwareContext
  helpers:
    - getCategoryRoute
  operations:
    - readNavigation post /navigation/{activeId}/{rootId}
    - readSeoUrl post /seo-url
    - readCategory post /category/{navigationId}
    - readBreadcrumb get /breadcrumb/{id}
  schemas:
    - NavigationRouteResponse
    - NavigationType
    - Category
    - Breadcrumb
    - SeoUrl
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Layout",
    action: "Load one navigation",
    detail:
      "useNavigation is created per type and passes that string into both path parameters, so main-navigation is sent where an id would be expected — a category id works there too and loads that sub-tree. The layout wraps the load in useAsyncData so the tree is server-rendered.",
    code: "useNavigation({ type: 'footer-navigation' })",
    state: "swNavigation-<type>",
    typeKeys: ['Schemas["NavigationType"]'],
  },
  {
    title: "Store API",
    action: "Return a flat or nested tree",
    detail:
      "readNavigation takes depth and buildTree alongside the criteria and answers with a bare array of categories. The header sw-include-seo-urls is always sent.",
    code: "loadNavigationElements({ depth: 2 })",
    state: "sw-context-token",
    typeKeys: [
      'operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"]',
    ],
  },
  {
    title: "Resolver",
    action: "Ask what the path is",
    detail:
      "useNavigationSearch().resolvePath() filters /seo-url on seoPathInfo, or on pathInfo for a technical path, and returns the matching SeoUrl. The home path short-circuits to the sales channel's navigationCategoryId without a request.",
    code: "const seoUrl = await resolvePath(route.path)",
    state: "none",
    typeKeys: ['operations["readSeoUrl post /seo-url"]["response"]'],
  },
  {
    title: "Route",
    action: "Hold the resolution",
    detail:
      "useNavigationContext stores that SeoUrl and issues no request of its own. routeName says whether the page is a category, a product or a landing page, and foreignKey is its id.",
    code: "const { routeName, foreignKey } = useNavigationContext(seoUrl)",
    state: "navigation context",
    typeKeys: ['Schemas["SeoUrl"]'],
  },
  {
    title: "Page",
    action: "Fetch the category",
    detail:
      "readCategory takes a ProductListingCriteria, because a category page is also a listing. The response is the category itself, not a search result.",
    code: "search(navigationId, { withCmsAssociations: true })",
    state: "category context",
    typeKeys: [
      'operations["readCategory post /category/{navigationId}"]["response"]',
    ],
  },
  {
    title: "Client",
    action: "Fetch the breadcrumbs",
    detail:
      "readBreadcrumb is a GET taking an id in the path. No composable calls it, so the page invokes it directly — in the starter from onMounted, after the category is already rendered.",
    code: 'apiClient.invoke("readBreadcrumb get /breadcrumb/{id}", { pathParams: { id } })',
    state: "none yet",
    typeKeys: [
      'operations["readBreadcrumb get /breadcrumb/{id}"]["response"]',
    ],
  },
  {
    title: "UI",
    action: "Render both",
    detail:
      "The layout renders the navigation from its own useAsyncData ref and a breadcrumb component reads breadcrumbs. The navigation survives route changes because the layout outlives them; the trail does not, because the component that provided it is the page.",
    code: "navigationElements, breadcrumbs",
    state: "swBreadcrumb, reactive UI",
    typeKeys: ['Schemas["Breadcrumb"]'],
  },
];
</script>

# Navigation and Breadcrumbs

## Goal

Load a main and a footer navigation, resolve which entity the current URL points at, and render a breadcrumb trail. The important part is that these are three unrelated pieces of state: the navigation is cached per type, the navigation context only holds what a separate resolver already fetched, and the breadcrumb trail is a shared array nothing fills for you.

## Shopware Flow

`readNavigation post /navigation/{activeId}/{rootId}` names its path parameters `activeId` and `rootId`, and the schema types both as `string | NavigationType`. `useNavigation({ type })` passes whatever it is given straight into both of them: a navigation type such as `main-navigation`, or a category id to load that sub-tree. The response is a bare array of categories rather than a search result.

Resolving a URL and holding the resolution are two different composables. `useNavigationSearch().resolvePath()` issues `readSeoUrl post /seo-url` and returns a `SeoUrl`; `useNavigationContext()` stores that value and never requests anything. Breadcrumbs go one step further: `readBreadcrumb get /breadcrumb/{id}` exists and no composable calls it. `useBreadcrumbs().buildDynamicBreadcrumbs()` takes that operation's _response_ as its argument, so the page has to invoke the request itself.

<RecipeFlowDiagram label="Navigation and breadcrumbs flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The layout calls `useNavigation({ type })` once per navigation and loads it inside `useAsyncData`.
2. `readNavigation post /navigation/{activeId}/{rootId}` returns a category array, cached under `swNavigation-<type>`.
3. The catch-all route calls `resolvePath(path)`, which asks `/seo-url` which entity that path belongs to.
4. `useNavigationContext(seoUrl)` holds the answer and exposes it as `routeName` and `foreignKey`.
5. The page fetches the category for that id, passing listing criteria because a category page is also a listing.
6. The page invokes `readBreadcrumb get /breadcrumb/{id}` itself and hands the response to `buildDynamicBreadcrumbs`, which writes the shared trail with router-ready paths.
7. The layout renders the tree from the ref it loaded, and a breadcrumb component reads `breadcrumbs` from the composable.

You do not need to reload the navigation on every route change, and you do not need to resolve a category link yourself. The tree is cached per type for the lifetime of the provide scope, which is why the layout loads it and pages do not, and every category in it already carries the SEO URL `getCategoryRoute` turns into a router target.

## Request Flow

| Step                  | Code                                            | Store API                              | Type                                                                                                       |
| --------------------- | ----------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Load a navigation     | `loadNavigationElements({ depth: 2 })`          | `POST /navigation/{activeId}/{rootId}` | <SchemaTypeTooltip type-key='operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"]' /> |
| Resolve the path      | `resolvePath(route.path)`                       | `POST /seo-url`                        | <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />                        |
| Fetch the category    | `useCategorySearch().search(navigationId)`      | `POST /category/{navigationId}`        | <SchemaTypeTooltip type-key='operations["readCategory post /category/{navigationId}"]["body"]' />          |
| Fetch the breadcrumbs | `invoke("readBreadcrumb get /breadcrumb/{id}")` | `GET /breadcrumb/{id}`                 | <SchemaTypeTooltip type-key='operations["readBreadcrumb get /breadcrumb/{id}"]["response"]' />             |
| Store the trail       | `buildDynamicBreadcrumbs(response.data)`        | none                                   | <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />                                                     |
| Append one breadcrumb | `pushBreadcrumb({ name, path })`                | none                                   | <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />                                                     |

The breadcrumb request is the only row without a composable. It also accepts a `type` query parameter, which selects whether the id is a product or a category and defaults to `product`, and `referrerCategoryId`, which picks the trail when a product is reachable through several categories.

The tooltip on the last two rows shows `Schemas["Breadcrumb"]`, the full wire shape. `pushBreadcrumb` is looser than that: it also accepts a bare `{ name, path }`, which is what you hand it for a crumb you build yourself.

The three POST rows are the default. Under `cacheableReads` the navigation, the path resolution and the category read each switch to their GET variant, so a proxy can cache them.

## Composables

Pick by what the composable is about — a tree, a path, an entity, or the trail:

| Composable             | Scope                       | Reach for it when                                                                |
| ---------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `useNavigation`        | one navigation tree         | rendering a main, footer or service navigation from `navigationElements`         |
| `useNavigationSearch`  | one path                    | turning a URL into a `SeoUrl` with `resolvePath()` in a catch-all route          |
| `useNavigationContext` | the resolved route          | reading `navigationContext`, `routeName` or `foreignKey` for the current page    |
| `useCategorySearch`    | one category by id          | fetching a category with `search()`, including the CMS associations a page needs |
| `useCategory`          | the category already loaded | injecting it deeper in the tree instead of threading it through props            |
| `useBreadcrumbs`       | the shared trail            | writing or rendering breadcrumbs anywhere below the component that provided it   |
| `useShopwareContext`   | the raw client              | invoking an operation no composable wraps, such as `readBreadcrumb`              |

`useNavigation` exposes `navigationElements` and `loadNavigationElements`, and `useNavigationContext` the three values in the row above. `useBreadcrumbs` is the one with a surface worth breaking down:

- **Read** — `breadcrumbs`, the shared trail.
- **Write** — `buildDynamicBreadcrumbs(response)` replaces the trail from a `readBreadcrumb` response; `pushBreadcrumb(breadcrumb)` appends a single `{ name, path }`.
- **Reset** — `clearBreadcrumbs()` empties it.

Six things the generated reference will not tell you:

- `loadNavigationElements(criteria)` takes the POST body, not a plain criteria object: `depth` and `buildTree` sit alongside the criteria fields. It also swallows its own errors — it sets the shared array to `[]`, logs, and resolves.
- `navigationElements` is typed `NavigationRouteResponse | null`, and the shared ref starts as `[]`. `useNavigation` closes over that ref at call time, so the layout's own `navigationElements` keeps pointing at it even after the layout re-provides the `useAsyncData` ref under the same key. Descendants read the re-provided ref; the layout has to render from its `useAsyncData` data instead.
- `resolvePath("/")` returns early with the sales channel's `navigationCategoryId` and never touches the Store API. Every other path costs one `/seo-url` request, with a technical-path fallback derived locally when nothing matches.
- `useNavigationContext(seoUrl)` creates a new context from the ref you pass; calling it with no argument injects whatever a component above provided, which in practice means the catch-all route. Off that route nothing is provided and nothing throws: `routeName` is `undefined` and `foreignKey` is `""`. Either way it issues no request — the `SeoUrl` it exposes was fetched by `resolvePath`.
- `buildDynamicBreadcrumbs` is `async` but does no I/O — it maps the response you already fetched. `breadcrumbs` is `undefined`, not `[]`, until the first write, so guard with `breadcrumbs?.length`.
- `useCategory(categoryResponse)` provides the category and `useCategory()` injects it, but the injecting call throws a `ContextError` when nothing was provided above it. `CmsElementCategoryNavigation` relies on the page having made that call. What you pass in is copied, not aliased, so a later `refresh()` of the source ref does not reach the consumers below.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the navigation criteria, the resolved URL, the breadcrumb response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readSeoUrl post /seo-url"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readBreadcrumb get /breadcrumb/{id}"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["NavigationRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["NavigationType"]' />
  <SchemaTypeTooltip type-key='Schemas["Category"]' />
  <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />
  <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type NavigationBody =
  operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"];
type BreadcrumbResponse =
  operations["readBreadcrumb get /breadcrumb/{id}"]["response"];
type NavigationRouteResponse = Schemas["NavigationRouteResponse"];
type NavigationType = Schemas["NavigationType"];
type Category = Schemas["Category"];
type Breadcrumb = Schemas["Breadcrumb"];
type SeoUrl = Schemas["SeoUrl"];
```

`NavigationRouteResponse` is declared as `Category[]` and `BreadcrumbResponse` as `Breadcrumb[]`, so both are iterable directly. `NavigationType` is the enum of the three accepted type strings. `Breadcrumb` here is the Store API shape, which requires `categoryId`, `type`, `translated` and `apiAlias` alongside `name` and `path`; `pushBreadcrumb` accepts a looser `{ name, path }` as well.

## Minimal Vue Example

The layout owns the navigation and renders it once. The page below owns the category and the breadcrumb trail.

<CodeExample title="Category page with breadcrumbs">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Ref } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{ navigationId: string }>();

const { search } = useCategorySearch();
const { routeName, foreignKey } = useNavigationContext();
const { breadcrumbs, buildDynamicBreadcrumbs, clearBreadcrumbs } =
  useBreadcrumbs();
const { apiClient } = useShopwareContext();
const router = useRouter();

const { data: categoryResponse, error } = await useAsyncData(
  `categoryPage${props.navigationId}`,
  async () => {
    try {
      return await search(props.navigationId, { withCmsAssociations: true });
    } catch (searchError) {
      if (searchError instanceof ApiClientError && searchError.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }
      throw searchError;
    }
  },
);

if (error.value) {
  throw error.value;
}

if (!categoryResponse.value) {
  throw createError({ statusCode: 404, statusMessage: "Category not found" });
}

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);

const isLoadingBreadcrumbs = ref(false);
const breadcrumbsError = ref<string | null>(null);
const breadcrumbRequest = import.meta.client
  ? new AbortController()
  : undefined;

clearBreadcrumbs();

if (import.meta.client) {
  const removeGuard = router.beforeEach((to, from) => {
    if (to.fullPath !== from.fullPath) breadcrumbRequest?.abort();
  });

  onBeforeUnmount(() => {
    breadcrumbRequest?.abort();
    removeGuard();
  });
}

onMounted(async () => {
  isLoadingBreadcrumbs.value = true;

  try {
    const response = await apiClient.invoke(
      "readBreadcrumb get /breadcrumb/{id}",
      {
        pathParams: { id: props.navigationId },
        fetchOptions: { signal: breadcrumbRequest?.signal },
      },
    );
    await buildDynamicBreadcrumbs(response.data);
  } catch (requestError) {
    if (breadcrumbRequest?.signal.aborted) return;
    breadcrumbsError.value = "The breadcrumb trail could not be loaded.";
    console.error("[CategoryPage]", requestError);
  } finally {
    isLoadingBreadcrumbs.value = false;
  }
});
</script>

<template>
  <nav aria-label="Breadcrumb">
    <p v-if="isLoadingBreadcrumbs" aria-live="polite">
      Loading the breadcrumb trail…
    </p>
    <p v-else-if="breadcrumbsError" role="alert">{{ breadcrumbsError }}</p>

    <ol v-else-if="breadcrumbs?.length">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="`${breadcrumb.name}-${index}`"
      >
        <NuxtLink
          v-if="breadcrumb.path && index < breadcrumbs.length - 1"
          :to="breadcrumb.path"
        >
          {{ breadcrumb.name }}
        </NuxtLink>
        <span
          v-else
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ breadcrumb.name }}
        </span>
      </li>
    </ol>
  </nav>

  <h1>{{ category.translated?.name ?? category.name }}</h1>

  <p v-if="routeName">
    This URL resolves to {{ routeName }} with the id {{ foreignKey }}.
  </p>
</template>
```

</CodeExample>

The page reads `useNavigationContext()` with no argument, which works because the catch-all route rendered it and provided the resolved `SeoUrl` above it. On a route that provides nothing the call does not throw — `routeName` comes back `undefined` and `foreignKey` an empty string.

The navigation lives one level up. The layout renders from the `useAsyncData` ref rather than from `navigationElements`, because `useNavigation` closed over its own ref before the re-provide and that ref stays empty on the client:

```vue
<script setup lang="ts">
import { getCategoryRoute } from "@shopware/helpers";

const { loadNavigationElements } = useNavigation();

const { data: mainNavigation } = await useAsyncData("mainNavigation", () =>
  loadNavigationElements({ depth: 2 }),
);

provide("swNavigation-main-navigation", mainNavigation);
</script>

<template>
  <nav aria-label="Main navigation">
    <p v-if="!mainNavigation?.length" role="alert">
      The navigation is not available.
    </p>

    <ul v-else>
      <li v-for="item in mainNavigation" :key="item.id">
        <NuxtLink :to="getCategoryRoute(item)">
          {{ item.translated?.name ?? item.name }}
        </NuxtLink>

        <ul v-if="item.children?.length">
          <li v-for="child in item.children" :key="child.id">
            <NuxtLink :to="getCategoryRoute(child)">
              {{ child.translated?.name ?? child.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

  <slot />
</template>
```

Keep the navigation landmark in the layout only. A page that renders its own `<nav aria-label="Main navigation">` adds a second landmark with the same accessible name, nested inside `<main>`.

The page that owns the entity is what fills the trail. A product page does the same thing with `referrerCategoryId` in the query, then calls `pushBreadcrumb` with the product's own name and SEO path — the starter appends that last crumb itself rather than reading it from the response.

## State And Session

Each navigation type gets its own shared value under `swNavigation-<type>`, so a main and a footer navigation coexist without overwriting each other. Two `useNavigation({ type: "main-navigation" })` calls in the same tree share one array — which is the point, and also why a second `loadNavigationElements` call replaces what the first one loaded.

That sharing is `inject` with a `provide` fallback, so it only reaches components below the one that provided. The starter layout goes one step further and re-provides the `useAsyncData` ref under `swNavigation-main-navigation` after loading, which is what carries the server-rendered tree into the client. Drop that line and nothing refetches — `useAsyncData` short-circuits during hydration, so the tree is lost rather than reloaded and the navigation stays empty.

`useBreadcrumbs` keeps a single `swBreadcrumb` value, and it is not application-wide. Whichever component calls `useBreadcrumbs()` highest in the tree — with no argument is enough — creates the ref and provides it, and every writer and reader has to sit below that component. It starts out `undefined` and becomes an array on the first write.

Where that call sits decides the lifetime. In the starter every caller is a page-level component and the breadcrumb bar is their child, so the ref is created and destroyed with the page: the trail does not survive a route change. Call `useBreadcrumbs()` in a layout or above `NuxtPage` instead and the same ref outlives every navigation — which is the arrangement that makes a stale trail, and an uncancelled breadcrumb request, something you have to handle.

Once a session context token exists, every request carries it as `sw-context-token`, so the language and currency in that context decide which translations and prices come back. The very first anonymous request goes out without the header and adopts the token from the response. Changing either invalidates the navigation you already loaded; reload it rather than translating the cached tree.

`useNavigationContext` holds route data rather than fetching it. It wraps the `SeoUrl` that `useNavigationSearch().resolvePath()` produced, and `routeName` is what a catch-all route branches on to decide which page component to render.

## Edge Cases

- `readNavigation` accepts either a navigation **type** or a category id in `activeId` and `rootId`, and `useNavigation({ type })` forwards either verbatim. `CmsElementCategoryNavigation` passes the active category's id to load a sub-tree, which then lives under `swNavigation-<categoryId>` and never collides with the main navigation.
- `loadNavigationElements` catches its own errors, sets the shared array to `[]` and logs. A failed load is indistinguishable from an empty navigation.
- `buildTree` is described as choosing between a tree and a flat list but is declared in the schema as an array of objects. Verify the shape against your Shopware version before relying on it.
- On the cacheable GET variant the composable strips `buildTree` and `depth` out of the criteria and sends them as dedicated query parameters. On the POST variant they stay in the body. A hand-rolled request has to match the variant it uses.
- `depth` counts the levels _below_ the root, so `depth: 1` returns the top level plus its children and `depth: 2` adds one more. A navigation rendered three levels deep with `depth: 1` shows no grandchildren and no error.
- `resolvePath` returns `null` when `/seo-url` matches nothing and no technical-path fallback applies. A catch-all route that does not check `foreignKey` renders a page component with an empty id.
- `resolvePath` rejects rather than returning `null` when the request itself fails — the `/seo-url` call is not wrapped. `null` means "no match", an exception means "could not ask". Map only `null` to a 404, or a Store API blip surfaces as an unhandled error page.
- `useCategorySearch().search()` rejects on any non-2xx. Reading only `data` from `useAsyncData` and treating a null value as "not found" turns every 500 and timeout into a 404 — cached for as long as your `isr` rule says. Read `error` and rethrow anything that is not a real 404.
- `readBreadcrumb get /breadcrumb/{id}` has no composable. `buildDynamicBreadcrumbs` consumes its response, so forgetting the request leaves the trail empty rather than failing.
- Fetching the trail from `onMounted` keeps it out of the server-rendered HTML. Whatever the template renders while the request is pending is what ships in the markup and what a crawler indexes, so start a loading flag at `false` and raise it inside `onMounted` rather than initialising it to `true`. If breadcrumbs must be in the initial markup, move the request into the same `useAsyncData` as the category and accept the extra server round trip.
- Nothing cancels the breadcrumb request for you. `buildDynamicBreadcrumbs` replaces the trail wholesale, so once the ref outlives the page a response that lands after the user has navigated away overwrites the new page's trail. Pass an `AbortController` signal and abort it from `router.beforeEach` and `onBeforeUnmount`, as the starter does.
- `buildDynamicBreadcrumbs` prefixes every `path` with `/`. Passing an already-absolute path produces `//path`.
- `pushBreadcrumb` mutates the shared array in place. Where the ref outlives the page, calling it on every route change without `clearBreadcrumbs()` grows the trail indefinitely.
- A stale trail is only possible where the ref sits above the page. The starter guards it four ways: `FrontendNavigationPage` and `FrontendDetailPage` call `clearBreadcrumbs()` in setup, the breadcrumb component clears it again from a `router.beforeEach` guard, the breadcrumb request is aborted from that guard and from `onBeforeUnmount`, and the ref is page-scoped so it dies with the page anyway. Only the abort covers a request already in flight.
- `readCategory post /category/{navigationId}` accepts a `ProductListingCriteria` and returns a `Category`, not a search result. The listing criteria apply to the category's embedded listing.
- `useCategory()` throws a `ContextError` when no category was provided above it. Provide it with `useCategory(categoryRef)` on the page.
- `useNavigation` always sends `sw-include-seo-urls: true`, so the categories carry the URLs a link needs. Do not resolve routes separately.

## Common Mistakes

- Do not assume `type` has to be one of the three navigation types. A category id fetches that sub-tree, under its own shared state key.
- Do not load the navigation in a page component, and do not load it from `onMounted`. Use `useAsyncData` in the layout so it is server-rendered once per type.
- Do not treat an empty `navigationElements` as proof the navigation is empty. Errors are swallowed.
- Do not expect `useNavigationContext` to resolve anything. `useNavigationSearch().resolvePath()` is what issues the request.
- Do not expect `useBreadcrumbs` to fetch anything. Invoke the breadcrumb operation yourself.
- Do not assume the trail is in the server-rendered HTML when you fetch it from `onMounted`.
- Do not call `pushBreadcrumb` without clearing the trail first on a route change.
- Do not assume the trail is application-wide. It belongs to the component that called `useBreadcrumbs()` highest in the tree.
- Do not let a failed category read fall through to a 404. Read `error` from `useAsyncData` and rethrow anything that is not a real 404.
- Do not prefix breadcrumb paths yourself. `buildDynamicBreadcrumbs` already does.
- Do not use `useCategory()` on a page that has not provided a category.
- Do not build category links by hand. Use the SEO URLs the navigation already includes.

## Testing Checklist

- The layout issues one `readNavigation post /navigation/{activeId}/{rootId}` request per navigation type, during the server render.
- The request carries the type string in both path parameters and the `sw-include-seo-urls` header.
- A second `useNavigation({ type })` in a child component issues no request and sees the same elements.
- A failing navigation load renders the empty state rather than throwing.
- `depth: 1` returns one level of children and `depth: 2` returns grandchildren.
- A path that no `SeoUrl` matches produces a 404 rather than a page component with an empty id.
- A category page fetches the breadcrumbs after mount and fills the shared trail.
- A 500 from `readCategory` renders a 500, not "Category not found".
- A failing `/seo-url` request renders an error page rather than a 404.
- Navigating away before the breadcrumb request resolves leaves the new page's trail intact.
- The server-rendered HTML contains no breadcrumb loading placeholder.
- Breadcrumb paths start with a single slash and resolve in the router.
- Navigating to a page that sets no breadcrumbs does not leave the previous trail visible.
- `routeName` and `foreignKey` reflect the entity the current URL resolves to.

## Related Links

- [Navigation page element](../../getting-started/page-elements/navigation.html)
- [Breadcrumbs page element](../../getting-started/page-elements/breadcrumbs.html)
- [Routing](../../getting-started/routing.html)
- [Product listing](../../getting-started/e-commerce/product-listing.html)
- [Helpers package](../../packages/helpers.html)
- [API client package](../../packages/api-client.html)
- [Composables reference](../../packages/composables/)
