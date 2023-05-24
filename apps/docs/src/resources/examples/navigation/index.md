# Navigation

## Simple navigation

<div class="flex flex-col items-center">

<img src="./simple-navigation-md.png" alt="Preview for medium screen size" class="hidden sm:block border-1 border-gray-200 rounded-md shadow-md hover:shadow-xl hover:scale-105 transform duration-300" />

<img src="./simple-navigation-sm.png" alt="Preview for small screen size" class="sm:hidden border-1 border-gray-200 rounded-md shadow-md hover:shadow-xl hover:scale-105 transform duration-300" />

</div>

<div>

```vue
<script setup lang="ts">
const { loadNavigationElements, navigationElements } = useNavigation();
await loadNavigationElements({ depth: 2 });

const { path: currentPath } = useRoute();

const isActive = (path: string) => {
  return "/" + path === currentPath;
};
</script>

<template>
  <div class="w-full shadow-lg mb-10 bg-white fixed">
    <nav
      class="w-full flex flex-col divide-gray-200 divide-y md:flex-row md:max-w-screen-xl md:mx-auto md:divide-y-0 md:divide-x"
    >
      <RouterLink
        v-for="navigationElement in navigationElements"
        :key="navigationElement.id"
        :to="'/' + navigationElement.seoUrls[0]?.seoPathInfo"
      >
        <div
          class="flex p-4 h-full border-l-5 hover:border-gray-200 md:border-l-none md:border-b-5 md:w-60 transition duration-200 items-center"
          :class="[
            isActive(navigationElement.seoUrls[0]?.seoPathInfo)
              ? 'border-indigo-500'
              : 'border-white',
          ]"
        >
          {{ navigationElement.translated.name }}
        </div>
      </RouterLink>
    </nav>
  </div>
</template>
```

</div>
