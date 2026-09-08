---
nav:
  position: 30
recipe:
  area: context
  status: stable
  frameworks:
    - vue
  composables:
    - useNavigation
    - useNavigationContext
    - useBreadcrumbs
    - useCategory
    - useCategorySearch
  helpers:
    - getCategoryRoute
  operations:
    - readNavigation post /navigation/{activeId}/{rootId}
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

const steps = [
  {
    title: "Layout",
    action: "Load one navigation",
    detail:
      "useNavigation is created per navigation type. The type string is passed as both path parameters, so main-navigation is used where an id would be expected.",
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
    title: "Route",
    action: "Resolve what the URL is",
    detail:
      "useNavigationContext holds the SeoUrl the router resolved. routeName says whether the page is a category, a product or a landing page, and foreignKey is its id.",
    code: "const { routeName, foreignKey } = useNavigationContext()",
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
    title: "Store API",
    action: "Fetch the breadcrumbs",
    detail:
      "readBreadcrumb is a GET taking an id in the path. No composable calls it — the page invokes it directly, usually in parallel with the category request.",
    code: 'apiClient.invoke("readBreadcrumb get /breadcrumb/{id}", { pathParams: { id } })',
    state: "none yet",
    typeKeys: [
      'operations["readBreadcrumb get /breadcrumb/{id}"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Store the trail",
    detail:
      "buildDynamicBreadcrumbs takes that response and writes the shared trail, prefixing each path with a slash so the router accepts it.",
    code: "buildDynamicBreadcrumbs(breadcrumbsResponse.data)",
    state: "swBreadcrumb",
    typeKeys: ['Schemas["Breadcrumb"]'],
  },
  {
    title: "UI",
    action: "Render both",
    detail:
      "The layout reads navigationElements, and a breadcrumb component reads breadcrumbs. Neither keeps its own copy, and both survive a route change until something overwrites them.",
    code: "navigationElements, breadcrumbs",
    state: "reactive UI",
    typeKeys: ['Schemas["Category"]'],
  },
];
</script>

# Navigation and Breadcrumbs

## Goal

Load a main and a footer navigation, resolve which entity the current URL points at, and render a breadcrumb trail. The important part is that these are three unrelated pieces of state: the navigation is cached per type, the navigation context is pure route data, and the breadcrumb trail is a shared array nothing fills for you.

## Shopware Flow

`readNavigation post /navigation/{activeId}/{rootId}` looks like it wants two ids and takes two navigation types instead. `useNavigation({ type })` passes the type string — `main-navigation`, `footer-navigation` or `service-navigation` — as both `activeId` and `rootId`, and the response is a bare array of categories.

Breadcrumbs work differently again. `readBreadcrumb get /breadcrumb/{id}` exists, and no composable calls it. `useBreadcrumbs().buildDynamicBreadcrumbs()` takes that operation's _response_ as its argument, so the page has to invoke the request itself — typically alongside the category request.

<RecipeFlowDiagram label="Navigation and breadcrumbs flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The layout calls `useNavigation({ type })` once per navigation and loads it.
2. `readNavigation post /navigation/{activeId}/{rootId}` returns a category array, cached under `swNavigation-<type>`.
3. `useNavigationContext()` exposes the `SeoUrl` the router resolved, as `routeName` and `foreignKey`.
4. The page fetches the category for that id, passing listing criteria because a category page is also a listing.
5. The page invokes `readBreadcrumb get /breadcrumb/{id}` itself, in parallel.
6. `buildDynamicBreadcrumbs(response)` writes the shared trail with router-ready paths.
7. The layout renders `navigationElements` and a breadcrumb component renders `breadcrumbs`.

You do not need to reload the navigation on every route change. It is cached per type for the lifetime of the provide scope, which is why the layout loads it and pages do not.

## Request Flow

| Step                  | Code                                            | Store API                              | Type                                                                                                       |
| --------------------- | ----------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Load a navigation     | `loadNavigationElements({ depth: 2 })`          | `POST /navigation/{activeId}/{rootId}` | <SchemaTypeTooltip type-key='operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"]' /> |
| Read the elements     | `navigationElements`                            | `POST /navigation/{activeId}/{rootId}` | <SchemaTypeTooltip type-key='Schemas["NavigationRouteResponse"]' />                                        |
| Read the resolved URL | `routeName`, `foreignKey`                       | none                                   | <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />                                                         |
| Fetch the category    | `useCategorySearch().search(navigationId)`      | `POST /category/{navigationId}`        | <SchemaTypeTooltip type-key='operations["readCategory post /category/{navigationId}"]["body"]' />          |
| Fetch the breadcrumbs | `invoke("readBreadcrumb get /breadcrumb/{id}")` | `GET /breadcrumb/{id}`                 | <SchemaTypeTooltip type-key='operations["readBreadcrumb get /breadcrumb/{id}"]["response"]' />             |
| Store the trail       | `buildDynamicBreadcrumbs(response.data)`        | none                                   | <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />                                                     |
| Append one crumb      | `pushBreadcrumb({ name, path })`                | none                                   | <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />                                                     |

The breadcrumb request is the only row without a composable. It also accepts `type` and `referrerCategoryId` query parameters, which matter when the same entity is reachable through several categories.

## Composables

- `useNavigation`: one navigation tree. Reads `navigationElements` and loads it with `loadNavigationElements(criteria)`. The instance is keyed by `type`, defaulting to `main-navigation`.
- `useNavigationContext`: the resolved `SeoUrl` for the current route. Reads `navigationContext`, `routeName` and `foreignKey`. It issues no requests at all.
- `useBreadcrumbs`: the shared trail. Reads `breadcrumbs`; writes with `buildDynamicBreadcrumbs(response)`, `pushBreadcrumb(crumb)` and `clearBreadcrumbs()`. Seed it with `useBreadcrumbs(initial)` from a root component.
- `useCategory`: the current category from context. `useCategory(category)` provides it, `useCategory()` injects it, and it throws a `ContextError` when nothing was provided.
- `useCategorySearch`: fetches the category for a navigation id with `search(navigationId, options)`, including the CMS associations a category page needs.

## Types

Use generated Store API types when you need to type the navigation criteria, the breadcrumb response, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readBreadcrumb get /breadcrumb/{id}"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["NavigationRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["NavigationType"]' />
  <SchemaTypeTooltip type-key='Schemas["Breadcrumb"]' />
  <SchemaTypeTooltip type-key='Schemas["SeoUrl"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type NavigationBody =
  operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"];
type BreadcrumbResponse =
  operations["readBreadcrumb get /breadcrumb/{id}"]["response"];
type NavigationElements = Schemas["NavigationRouteResponse"];
type NavigationType = Schemas["NavigationType"];
type Breadcrumb = Schemas["Breadcrumb"];
```

`NavigationElements` is declared as `Category[]`, so `navigationElements` is iterable directly. `NavigationType` is the enum of the three accepted type strings.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getCategoryRoute } from "@shopware/helpers";

const { navigationElements, loadNavigationElements } = useNavigation({
  type: "main-navigation",
});
const { breadcrumbs } = useBreadcrumbs();
const { routeName, foreignKey } = useNavigationContext();

const isLoading = ref(true);

onMounted(async () => {
  // cached per type, so this belongs in the layout rather than in a page
  await loadNavigationElements({ depth: 2 });
  isLoading.value = false;
});
</script>

<template>
  <nav aria-label="Main navigation">
    <p v-if="isLoading">Loading the navigation…</p>

    <p v-else-if="!navigationElements?.length">
      The navigation could not be loaded.
    </p>

    <ul v-else>
      <li v-for="category in navigationElements" :key="category.id">
        <NuxtLink :to="getCategoryRoute(category)">
          {{ category.translated?.name ?? category.name }}
        </NuxtLink>

        <ul v-if="category.children?.length">
          <li v-for="child in category.children" :key="child.id">
            <NuxtLink :to="getCategoryRoute(child)">
              {{ child.translated?.name ?? child.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

  <nav v-if="breadcrumbs?.length" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, index) in breadcrumbs" :key="`${crumb.name}-${index}`">
        <NuxtLink
          v-if="crumb.path && index < breadcrumbs.length - 1"
          :to="crumb.path"
        >
          {{ crumb.name }}
        </NuxtLink>
        <span v-else aria-current="page">{{ crumb.name }}</span>
      </li>
    </ol>
  </nav>

  <p v-if="routeName">
    This URL resolves to {{ routeName }} with the id {{ foreignKey }}.
  </p>
</template>
```

The page that owns the entity is what fills the trail. Fetch `readBreadcrumb get /breadcrumb/{id}` there alongside the category or product request, then hand the response to `buildDynamicBreadcrumbs`.

## State And Session

Each navigation type gets its own shared value under `swNavigation-<type>`, so a main and a footer navigation coexist without overwriting each other. Two `useNavigation({ type: "main-navigation" })` calls in the same tree share one array — which is the point, and also why a second `loadNavigationElements` call replaces what the first one loaded.

`useBreadcrumbs` keeps a single `swBreadcrumb` array. It is not scoped to a route, so it survives navigation until something replaces or clears it. Seeding it once from the application root — `useBreadcrumbs()` with no argument is enough to establish the provide — is what makes every page below able to write to it.

`useNavigationContext` is the only composable here with no request and no fetching at all. It wraps the `SeoUrl` a URL resolver produced, and `routeName` is what a catch-all route branches on to decide which page component to render.

## Edge Cases

- `readNavigation` takes navigation **types** where its path parameters are named `activeId` and `rootId`. Passing a category id there is not what the composable does.
- `loadNavigationElements` catches its own errors, sets the shared array to `[]` and logs. A failed load is indistinguishable from an empty navigation.
- `buildTree` is described as choosing between a tree and a flat list but is declared in the schema as an array of objects. Verify the shape against your Shopware version before relying on it.
- On the cacheable GET variant the composable strips `buildTree` and `depth` out of the criteria and sends them as dedicated query parameters. On the POST variant they stay in the body. A hand-rolled request has to match the variant it uses.
- `depth` controls how many levels come back. A navigation rendered two levels deep with `depth: 1` shows no children and no error.
- `readBreadcrumb get /breadcrumb/{id}` has no composable. `buildDynamicBreadcrumbs` consumes its response, so forgetting the request leaves the trail empty rather than failing.
- `buildDynamicBreadcrumbs` prefixes every `path` with `/`. Passing an already-absolute path produces `//path`.
- `pushBreadcrumb` mutates the shared array in place. Calling it on every route change without `clearBreadcrumbs()` grows the trail indefinitely.
- The trail is global. A page that sets breadcrumbs and a page that does not will show the previous page's trail unless one of them clears it.
- `readCategory post /category/{navigationId}` accepts a `ProductListingCriteria` and returns a `Category`, not a search result. The listing criteria apply to the category's embedded listing.
- `useCategory()` throws a `ContextError` when no category was provided above it. Provide it with `useCategory(categoryRef)` on the page.
- `useNavigation` always sends `sw-include-seo-urls: true`, so the categories carry the URLs a link needs. Do not resolve routes separately.

## Common Mistakes

- Do not pass a category id as the navigation type.
- Do not load the navigation in a page component. It is cached per type — load it in the layout.
- Do not treat an empty `navigationElements` as proof the navigation is empty. Errors are swallowed.
- Do not expect `useBreadcrumbs` to fetch anything. Invoke the breadcrumb operation yourself.
- Do not call `pushBreadcrumb` without clearing the trail first on a route change.
- Do not prefix breadcrumb paths yourself. `buildDynamicBreadcrumbs` already does.
- Do not use `useCategory()` on a page that has not provided a category.
- Do not build category links by hand. Use the SEO URLs the navigation already includes.

## Testing Checklist

- The layout issues one `readNavigation post /navigation/{activeId}/{rootId}` request per navigation type.
- The request carries the type string in both path parameters and the `sw-include-seo-urls` header.
- A second `useNavigation({ type })` in a child component issues no request and sees the same elements.
- A failing navigation load renders the empty state rather than throwing.
- `depth: 2` returns children, and `depth: 1` returns none.
- A category page fetches the breadcrumbs in parallel with the category and fills the shared trail.
- Breadcrumb paths start with a single slash and resolve in the router.
- Navigating to a page that sets no breadcrumbs does not leave the previous trail visible.
- `routeName` and `foreignKey` reflect the entity the current URL resolves to.

## Related Links

- [Navigation page element](../../getting-started/page-elements/navigation.html)
- [Breadcrumbs page element](../../getting-started/page-elements/breadcrumbs.html)
- [Routing](../../getting-started/routing.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
