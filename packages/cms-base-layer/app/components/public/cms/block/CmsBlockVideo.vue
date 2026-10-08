<script setup lang="ts">
import type { CmsBlockVideo } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockVideo;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const slotContent = computed(() => getSlotContent("video"));
</script>
<template>
  <div class="cms-block-video">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
