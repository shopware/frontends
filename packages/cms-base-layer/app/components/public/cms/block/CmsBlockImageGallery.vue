<script setup lang="ts">
import type { CmsBlockImageGallery } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageGallery;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const cmsContent = computed(() => getSlotContent("imageGallery"));
</script>

<template>
  <div class="cms-block-image-gallery">
    <CmsGenericElement :content="cmsContent" />
  </div>
</template>
