<script setup lang="ts">
import { useCmsSection } from "@shopware-pwa/composables-next/composables";
import type { CmsSectionSidebar } from "@shopware-pwa/composables-next/composables";
import { computed } from "vue";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
const { getPositionContent } = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");
const mobileBehavior = computed(() => props.content.mobileBehavior);
</script>

<template>
  <div class="cms-section-sidebar grid grid-cols-12 md:grid">
    <div class="col-span-12 md:col-span-9 order-2 md:order-2">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        class="overflow-auto"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </div>
    <div
      :class="{
        'align-top col-span-12 md:col-span-3 order-1 md:order-1':
          mobileBehavior !== 'hidden',
        'hidden md:block': mobileBehavior === 'hidden',
      }"
    >
      <CmsGenericBlock
        v-for="cmsBlock in sidebarBlocks"
        class="overflow-auto"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </div>
  </div>
</template>
