<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
</script>
<template>
  <nav class="container mx-auto flex mt-8 mb-8" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <nuxt-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <div class="w-5 h-5 i-carbon-home mr-2" />
          Home
        </nuxt-link>
        <div class="w-5 h-5 i-carbon-chevron-right" />
      </li>
      <li
        class="inline-flex items-center"
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
      >
        <nuxt-link
          v-if="breadcrumb.path"
          :to="breadcrumb.path"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {{ breadcrumb.name }}
        </nuxt-link>
        <span
          v-else
          class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          {{ breadcrumb.name }}
        </span>
        <div
          v-if="index < breadcrumbs.length - 1"
          class="w-5 h-5 i-carbon-chevron-right"
        ></div>
      </li>
    </ol>
  </nav>
</template>
