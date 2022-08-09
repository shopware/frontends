# Create a Navigation

In this chapter you will learn how to

- Fetch the navigation of a store
- Display navigation items

## Fetch the navigation

We can retrieve the navigation of a store using the `useNavigation` composable hook.

```js
const { loadNavigationElements, navigationElements } = useNavigation();
```

The `navigationElements` property is a reactive reference to the navigation items which is updated as we fetch the navigation elements:

```js
await loadNavigationElements({ depth: 2 });
```

## Build a navigation template

Now all values can be accessed in the template to build a navigation menu

```vue
<script setup lang="ts">
const { loadNavigationElements, navigationElements } = useNavigation();
await loadNavigationElements({ depth: 2 });
</script>

<template>
  <ul>
    <li
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
    >
      <router-link :to="'/' + navigationElement.seoUrls[0]?.seoPathInfo">
        {{ navigationElement.translated.name }}
      </router-link>
    </li>
  </ul>
</template>
```
