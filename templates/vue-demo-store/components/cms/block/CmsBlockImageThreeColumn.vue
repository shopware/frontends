<script setup lang="ts">
import { CmsBlockImageThreeColumn } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");

const { navigationElements } = useNavigation();
</script>
<template>
  <div class="grid md:grid-cols-3 gap-8">
    <template v-if="props.content?.name?.toLowerCase() !== 'categories'">
      <CmsGenericElement :content="leftContent" />
      <CmsGenericElement :content="centerContent" />
      <CmsGenericElement :content="rightContent" />
    </template>
    <template v-else>
      <div class="flex relative">
        <CmsGenericElement class="w-full h-full" :content="leftContent" />
        <div class="pointer-events-none bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[0].name }}</p>
          <button class="bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-50 text-gray-700 py-2 px-4 text-sm font-medium mb-6">{{ $t('shop_now') }}</button>
        </div>
      </div>
      <div class="flex relative">
        <CmsGenericElement class="w-full h-full" :content="centerContent" />
        <div class="pointer-events-none bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[1].name }}</p>
          <button class="bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-50 text-gray-700 py-2 px-4 text-sm font-medium mb-6">{{ $t('shop_now') }}</button>
        </div>
      </div>
      <div class="flex relative">
        <CmsGenericElement class="w-full h-full" :content="rightContent" />
        <div class="pointer-events-none bg-gradient-to-t from-gray-600 w-full text-center absolute bottom-0 left-1/2 translate -translate-x-1/2">
          <p class="pt-5 font-medium text-xl text-white mb-4">{{ navigationElements?.[2].name }}</p>
          <button class="bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-50 text-gray-700 py-2 px-4 text-sm font-medium mb-6">{{ $t('shop_now') }}</button>
        </div>
      </div>
    </template>
  </div>
</template>
