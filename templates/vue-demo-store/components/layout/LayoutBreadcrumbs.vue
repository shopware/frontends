<script setup lang="ts">
// const { breadcrumbs } = useBreadcrumbs();
</script>
<template>
  <nav class="container mx-auto flex mt-8 mb-8" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <nuxt-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <div class="w-5 h-5 i-carbon-home mr-2"></div>
          Home
        </nuxt-link>
        <div class="w-5 h-5 i-carbon-chevron-right"></div>
      </li>
    </ol>
  </nav>
</template>
