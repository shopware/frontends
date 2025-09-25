<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <nav
    class="hidden lg:flex max-w-screen-xl mt-8 mb-8 px-4 sm:px-6"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li   class="inline-flex items-center">
        <LayoutBreadcrumbsElement :to="formatLink(`/`)">
          <div class="flex items-center">
            <div class="w-5 h-5 i-carbon-home mr-2" />
            <div>{{ $t("home") }}</div>
          </div>
        </LayoutBreadcrumbsElement>
        <LayoutBreadcrumbsDivider />
      </li>
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
        class="inline-flex items-center"
      >
        <NuxtLink v-if="breadcrumb.path" :to="formatLink(breadcrumb.path)">
          <LayoutBreadcrumbsElement>
            {{ breadcrumb.name }}
          </LayoutBreadcrumbsElement>
        </NuxtLink>
        <LayoutBreadcrumbsElement v-else>
          {{ breadcrumb.name }}
        </LayoutBreadcrumbsElement>
        <LayoutBreadcrumbsDivider v-if="index < breadcrumbs.length - 1" />
      </li>
    </ol>
  </nav>
</template>
