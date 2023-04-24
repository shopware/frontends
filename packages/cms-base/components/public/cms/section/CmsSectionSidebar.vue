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
  <div class="cms-section-sidebar flex flex-col md:block">
    <div
      :class="{
        'inline-block align-top w-12/12 md:w-3/12 order-2 md:order-1':
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
    <div class="inline-block w-12/12 md:w-9/12 order-1 md:order-2">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        class="overflow-auto"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </div>
  </div>
</template>
