<script setup lang="ts">
import { useCmsSection } from "@shopware-pwa/composables-next";
import type { CmsSectionSidebar } from "@shopware-pwa/composables-next";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import { useCategory } from "#imports";
import { computed } from "vue";

const props = defineProps<{
  content: CmsSectionSidebar;
}>();
const { getPositionContent } = useCmsSection(props.content);

const sidebarBlocks = getPositionContent("sidebar");
const mainBlocks = getPositionContent("main");
const mobileBehavior = computed(() => props.content.mobileBehavior);
const { category } = useCategory();
</script>

<template>
  <div class="cms-section-sidebar grid grid-cols-12 md:grid">
    <div class="col-span-12 mx-8 md:mx-5 mt-8">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
        {{ getTranslatedProperty(category, "name") }}
      </h1>
    </div>
    <div class="col-span-12 md:col-span-7 lg:col-span-9 order-1 md:order-2">
      <CmsGenericBlock
        v-for="cmsBlock in mainBlocks"
        :key="cmsBlock.id"
        class="overflow-auto"
        :content="cmsBlock"
      />
    </div>
    <div
      :class="{
        'align-top col-span-12 md:col-span-5 lg:col-span-3 order-2 md:order-1':
          mobileBehavior !== 'hidden',
        'hidden md:block': mobileBehavior === 'hidden',
      }"
    >
      <CmsGenericBlock
        v-for="cmsBlock in sidebarBlocks"
        :key="cmsBlock.id"
        class="overflow-auto"
        :content="cmsBlock"
      />
    </div>
  </div>
</template>
