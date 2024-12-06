<script setup lang="ts">
import { computed } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const elementType = computed(() =>
  props.content.apiAlias === "cms_block"
    ? "Block"
    : props.content.apiAlias === "cms_section"
      ? "Section"
      : "Element",
);

const componentName = computed(() => props.content.type);
</script>
Ū
<template>
  <span class="sw-text-error">
    <b>
      {{ elementType }}<i> {{ componentName }} </i>
    </b>
    is not implemented yet!
  </span>
</template>
