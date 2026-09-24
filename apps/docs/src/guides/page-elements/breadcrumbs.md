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

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/building-breadcrumbs-for-a-static-page.ts" code lang="ts" no-name -->

```ts
import { useBreadcrumbs } from "#imports";

useBreadcrumbs([
  {
    name: "Shopware",
    path: "/shopware",
  },
]);
```

<!-- /automd -->

## Building breadcrumbs for a category/product page

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/building-breadcrumbs-for-a-category-product-page.txt" code lang="ts" no-name -->

```ts
// props.navigationId is a page id

import { useBreadcrumbs } from "#imports";

const { buildDynamicBreadcrumbs } = useBreadcrumbs();
buildDynamicBreadcrumbs(props.navigationId);
```

<!-- /automd -->

## Building breadcrumbs for CMS pages - without additional request

Each CMS page contains the `Category` with `breadcrumb` array, which contains a list of names, like:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/building-breadcrumbs-for-cms-pages-without-additional-request" code no-name -->

```
breadcrumb: ["Home", "Main navigation ", "Summer Party"]
```

<!-- /automd -->

we can convert current `string` array to the `Breadcrumb` object using [getCategoryBreadcrumbs](../../packages/helpers.html#getcategorybreadcrumbs) helper, and then pass it to [useBreadcrumbs](../../packages/composables/useBreadcrumbs) composable.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/building-breadcrumbs-for-cms-pages-without-additional-request.txt" code lang="ts" no-name -->

```ts
import { getCategoryBreadcrumbs } from "@shopware/helpers";

import { useBreadcrumbs } from "#imports";

let breadcrumbs = getCategoryBreadcrumbs(
  productResponse.value?.product?.seoCategory,
);
useBreadcrumbs(breadcrumbs);
```

<!-- /automd -->

## Clearing breadcrumbs list

It's important to clear breadcrumbs list when you leave the page, otherwise you'll see breadcrumbs from the previous page if your not setting them on that page.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/clearing-breadcrumbs-list.ts" code lang="ts" no-name -->

```ts
import { onBeforeRouteLeave, useBreadcrumbs } from "#imports";

const { clearBreadcrumbs } = useBreadcrumbs();

onBeforeRouteLeave(() => {
  clearBreadcrumbs();
});
```

<!-- /automd -->

## Displaying Breadcrumbs

Breadcrumbs are stored in sharable variable `breadcrumbs` in [useBreadcrumbs](../../packages/composables/useBreadcrumbs) composable.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/page-elements/breadcrumbs/displaying-breadcrumbs.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useBreadcrumbs } from "#imports";
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

<!-- /automd -->
