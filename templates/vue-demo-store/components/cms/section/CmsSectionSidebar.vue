<script setup lang="ts">
import {
  CmsSectionSidebar,
  useCmsSection,
} from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
const { getPositionContent } = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");
const mobileBehavior = computed(() => props.content.mobileBehavior);
</script>

<template>
  <div class="cms-section-sidebar flex flex-col lg:flex-row lg:space-x-8">
    <aside
      :class="{
        'w-70': true,
        block: mobileBehavior !== 'hidden',
        'hidden lg:block': mobileBehavior === 'hidden',
      }"
    >
      <CmsGenericBlock
        v-for="cmsBlock in sidebarBlocks"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </aside>
    <div class="flex-1">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </div>
  </div>
</template>
