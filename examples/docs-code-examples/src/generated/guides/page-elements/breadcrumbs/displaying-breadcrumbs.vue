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
