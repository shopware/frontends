<script setup lang="ts">
import { CmsBlockImageCover } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageCover;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const cmsContent = getSlotContent("image");
</script>
<template>
  <div class="cms-block-image-cover relative">
    <CmsGenericElement v-if="cmsContent" :content="cmsContent" :loading="props.content.name =='hero' ? 'preload' : 'eager'" />
    <div class="absolute bottom-0 left-1/2 translate -translate-x-1/2 text-white text-center" v-if="props.content.name?.toLowerCase() === 'introduction'">
      <p class="font-semibold mb-2 uppercase">{{ $t('new_collection') }}</p>
      <p class="text-3xl md:text-4xl mb-8 whitespace-nowrap" v-html="$t('shop_the_new_signature_collection')"></p>
      <button class="mb-16 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-50 py-3 px-6 font-medium">{{ $t('show_collection') }}</button>
    </div>
  </div>
</template>