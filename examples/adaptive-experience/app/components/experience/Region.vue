<script setup lang="ts">
import type { ExperienceModule } from "#shared/experience/types";

import { moduleComponents } from "./moduleComponents";

defineProps<{
  modules: ExperienceModule[];
}>();

// Priorities are normalized within a region by the merger, so render order is
// the module array order. A disabled module (kept across a mode change so the
// shopper's own placements survive) is skipped, not deleted.
const isRenderable = (module: ExperienceModule) =>
  module.enabled && Boolean(moduleComponents[module.type]);
</script>

<template>
  <!--
    §10/§12: modules resolve through the closed component map, so a patch can
    never name an arbitrary component. Each is isolated in an error boundary, so
    one that throws degrades to nothing instead of taking the page down.
  -->
  <template v-for="module in modules" :key="module.id">
    <NuxtErrorBoundary v-if="isRenderable(module)">
      <component :is="moduleComponents[module.type]" v-bind="module.props" />
      <template #error>
        <div class="hidden" :data-experience-module-failed="module.id" />
      </template>
    </NuxtErrorBoundary>
  </template>
</template>
