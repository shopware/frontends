<script setup lang="ts">
import type { CmsBlock } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsBlock;
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
