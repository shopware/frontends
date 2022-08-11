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
  <div class="cms-section-sidebar grid md:grid-cols-4">
    <div
      :class="{
        block: mobileBehavior !== 'hidden',
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
    <div class="md:col-span-3">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        class="overflow-auto"
        :key="cmsBlock.id"
        :content="cmsBlock"
      />
    </div>
  </div>
</template>
