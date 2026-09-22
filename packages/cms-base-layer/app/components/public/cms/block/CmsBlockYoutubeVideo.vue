<script setup lang="ts">
import type { CmsBlockYoutubeVideo } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockYoutubeVideo;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const slotContent = computed(() => getSlotContent("video"));
</script>
<template>
  <div class="cms-block-youtube-video relative">
    <CmsGenericElement :content="slotContent" />
  </div>
</template>
