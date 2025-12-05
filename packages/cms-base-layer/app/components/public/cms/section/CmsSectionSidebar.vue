<script setup lang="ts">
import { useCmsSection } from "@shopware/composables";
import type { CmsSectionSidebar } from "@shopware/composables";
import { computed } from "vue";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
const { getPositionContent, section } = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");
const mobileBehavior = computed(() => props.content.mobileBehavior);
const fullWidth = computed(() => section.sizingMode === "full_width");
</script>

<template>
  <div class="self-stretch flex flex-col lg:flex-row items-stretch gap-16" :class="{
    'px-6': fullWidth,
  }">
    <aside :class="{
      'w-full lg:w-72 xl:w-80 flex-shrink-0 bg-surface-surface flex flex-col justify-start items-stretch gap-4 lg:sticky lg:top-20':
        mobileBehavior !== 'hidden',
      'hidden lg:block': mobileBehavior === 'hidden',
    }">
      <div v-for="cmsBlock in sidebarBlocks" :key="cmsBlock.id" class="w-full">
        <CmsGenericBlock :content="cmsBlock" />
      </div>
    </aside>
    <main class="flex-1 flex flex-col justify-start items-stretch gap-20">
      <div v-for="cmsBlock in mainBlocks" :key="cmsBlock.id" class="w-full">
        <CmsGenericBlock :content="cmsBlock" />
      </div>
    </main>
  </div>
</template>
