<script setup lang="ts">
const { breadcrumbs } = useBreadcrumbs();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <nav
    class="container flex my-4 md:my-6"
    aria-label="Breadcrumb"
  >
    <ol class="flex-wrap inline-flex items-center space-x-2">
      <li class="inline-flex items-center">
        <nuxt-link
          to="/"
          class="text-gray-500 inline-flex items-center text-xs md:text-sm font-medium"
        >
          {{ $t('home') }}
        </nuxt-link>
        <span class="font-medium ml-2 w-5 h-5 text-center text-sm text-gray-300">/</span>
      </li>
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.path"
        class="inline-flex items-center"
      >
        <NuxtLink
          v-if="breadcrumb.path"
          :to="breadcrumb.path"
          :class="[
            'inline-flex items-center text-xs md:text-sm font-medium text-gray-500',
            (index === breadcrumbs.length - 1) ? 'text-gray-900' : 'text-gray-500'
          ]"
        >
          {{ breadcrumb.name }}
        </NuxtLink>
        <span
          v-else
          :class="[
            'inline-flex items-center text-xs md:text-sm font-medium',
            (index === breadcrumbs.length - 1) ? 'text-gray-900' : 'text-gray-500'
          ]"
        >
          {{ breadcrumb.name }}
        </span>
        <span v-if="index !== breadcrumbs.length - 1" class="ml-2 font-medium w-5 h-5 text-center text-sm text-gray-300">/</span>
      </li>
    </ol>
  </nav>
</template>
