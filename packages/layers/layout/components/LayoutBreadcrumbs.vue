<script setup lang="ts" generic="T extends { name: string; path: string }">
defineProps<{
  breadcrumbs: T[];
}>();
</script>
<template>
  <nav
    aria-label="Breadcrumb"
    class="max-w-7xl mx-auto p-6 font-sans"
  >
    <ol class="inline-flex items-center">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
        class="inline-flex items-center"
      >
        <NuxtLink v-if="breadcrumb.path" activeClass="font-bold text-brand-primary" :to="breadcrumb.path" class="no-underline">
          <LayoutBreadcrumbsElement :label="breadcrumb.name" />
        </NuxtLink>
        <LayoutBreadcrumbsElement v-else :label="breadcrumb.name" />
        <LayoutBreadcrumbsDivider
          v-if="index < breadcrumbs.length - 1"
          class="w-6 h-6 relative"
        />
      </li>
    </ol>
  </nav>
</template>
