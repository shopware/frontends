<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <nav
    class="hidden lg:flex max-w-screen-xl mx-auto mt-8 mb-8 px-4 sm:px-6"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink
          :to="formatLink(`/`)"
          class="inline-flex items-center text-sm font-medium text-secondary-700 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
        >
          <div class="w-5 h-5 i-carbon-home mr-2" />
          {{ $t("home") }}
        </NuxtLink>
        <div class="w-5 h-5 i-carbon-chevron-right" />
      </li>
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
        class="inline-flex items-center"
      >
        <NuxtLink
          v-if="breadcrumb.path"
          :to="formatLink(breadcrumb.path)"
          class="inline-flex items-center text-sm font-medium text-secondary-700 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
        >
          {{ breadcrumb.name }}
        </NuxtLink>
        <span
          v-else
          class="inline-flex items-center text-sm font-medium text-secondary-700 dark:text-secondary-400 dark:hover:text-white"
        >
          {{ breadcrumb.name }}
        </span>
        <div
          v-if="index < breadcrumbs.length - 1"
          class="w-5 h-5 i-carbon-chevron-right"
        />
      </li>
    </ol>
  </nav>
</template>
