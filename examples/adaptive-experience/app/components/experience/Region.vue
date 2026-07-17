<script setup lang="ts">
import type { ExperienceModule } from "#shared/experience/types";

import { moduleComponents } from "./moduleComponents";

defineProps<{
  modules: ExperienceModule[];
}>();
</script>

<template>
  <!--
    Modules are resolved through the closed registry: an unregistered type cannot
    reach `component :is`, so a patch can never name an arbitrary component.
    Each module is isolated so one that throws degrades to nothing instead of
    taking the page down with it.
  -->
  <NuxtErrorBoundary v-for="module in modules" :key="module.id">
    <component :is="moduleComponents[module.type]" v-bind="module.props" />
    <template #error>
      <div class="hidden" :data-experience-module-failed="module.id" />
    </template>
  </NuxtErrorBoundary>
</template>
