<script setup lang="ts">
import { CmsSectionSidebar } from "@shopware-pwa/composables-next";
import { useCmsSection } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();

const { getPositionContent } = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");

let boxedSizing = computed(() => props.content.sizingMode === "boxed");
</script>

<template>
  <div
    class="cms-section-sidebar grid grid-cols-4"
    :class="[boxedSizing ? ['max-w-screen-xl', 'mx-auto'] : '']"
  >
    <div>
      <CmsGenericBlock
        v-for="cmsBlock in sidebarBlocks"
        :key="cmsBlock.id"
        :content="cmsBlock"
        class="overflow-auto bg-center bg-cover"
      />
    </div>
    <div class="col-span-3">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        :key="cmsBlock.id"
        :content="cmsBlock"
        class="overflow-auto bg-center bg-cover"
      />
    </div>
  </div>
</template>
