<script setup lang="ts">
import type { CmsBlockImageSimpleGrid } from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageSimpleGrid;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftTopContent = computed(() => getSlotContent("left-top"));
const leftBottomContent = computed(() => getSlotContent("left-bottom"));
const rightContent = computed(() => getSlotContent("right"));
</script>

<template>
  <div class="flex flex-col md:flex-row justify-start items-start gap-6 w-full">
    <div class="w-full md:flex-1 flex flex-col justify-start items-start gap-6">
      <div class="w-full">
        <CmsGenericElement :content="leftTopContent" />
      </div>
      <div class="w-full">
        <CmsGenericElement :content="leftBottomContent" />
      </div>
    </div>
    <div class="w-full md:flex-1">
      <CmsGenericElement :content="rightContent" />
    </div>
  </div>
</template>
