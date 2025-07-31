---
head:
  - - meta
    - name: og:title
      content: "Breadcrumbs"
  - - meta
    - name: og:description
      content: "In this chapter, you will learn how to manage breadcrumbs."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Breadcrumbs.png?fontSize=150px"
nav:
  position: 30
---

# Breadcrumbs managing

In this chapter you will learn how to

- Build breadcrumbs for static page
- Build dynamic breadcrumbs for category/product page

### Quick reference

- [useBreadcrumbs](../../packages/composables/useBreadcrumbs) is a composable used for a breadcrumbs management with sharable state
- [getCategoryBreadcrumbs](../../packages/helpers.html#getcategorybreadcrumbs) is a helper used for converting `Category` to the `Breadcrumb` object
- [getCmsBreadcrumbs](../../packages/helpers#getcmsbreadcrumbs) is a helper used for building breadcrumbs for `Landing Pages`

## Building breadcrumbs for a static page

```ts
useBreadcrumbs([
  {
    name: "Shopware",
    path: "/shopware",
  },
]);
```

## Building breadcrumbs for a category/product page

```ts
// props.navigationId is a page id

const { buildDynamicBreadcrumbs } = useBreadcrumbs();
buildDynamicBreadcrumbs(props.navigationId);
```

## Building breadcrumbs for CMS pages - without additional request

Each CMS page contains the `Category` with `breadcrumb` array, which contains a list of names, like:

```
breadcrumb: ["Home", "Main navigation ", "Summer Party"]
```

we can convert current `string` array to the `Breadcrumb` object using [getCategoryBreadcrumbs](../../packages/helpers.html#getcategorybreadcrumbs) helper, and then pass it to [useBreadcrumbs](../../packages/composables/useBreadcrumbs) composable.

```ts
import { getCategoryBreadcrumbs } from "@shopware/helpers";

let breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product?.seoCategory,
);
useBreadcrumbs(breadcrumbs);
```

## Clearing breadcrumbs list

It's important to clear breadcrumbs list when you leave the page, otherwise you'll see breadcrumbs from the previous page if your not setting them on that page.

```ts
const { clearBreadcrumbs } = useBreadcrumbs();

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});
```

## Displaying Breadcrumbs

Breadcrumbs are stored in sharable variable `breadcrumbs` in [useBreadcrumbs](../../packages/composables/useBreadcrumbs) composable.

```vue
<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
</script>
<template>
  <nav>
    <ol>
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.path">
        <NuxtLink v-if="breadcrumb.path" :to="breadcrumb.path">
          {{ breadcrumb.name }}
        </NuxtLink>
        <span v-else>
          {{ breadcrumb.name }}
        </span>
        <div v-if="index < breadcrumbs.length - 1"></div>
      </li>
    </ol>
  </nav>
</template>
```
