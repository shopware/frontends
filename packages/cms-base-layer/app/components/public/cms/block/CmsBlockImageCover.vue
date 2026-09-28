<script setup lang="ts">
import type { CmsBlockImageCover } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageCover;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const cmsContent = computed(() => getSlotContent("image"));
</script>
<template>
  <div class="cms-block-image-cover">
    <CmsGenericElement v-if="cmsContent" :content="cmsContent" />
  </div>
</template>
