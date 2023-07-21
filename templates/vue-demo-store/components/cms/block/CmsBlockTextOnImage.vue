<script setup lang="ts">
import { CmsBlockTextOnImage } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockTextOnImage;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("content");
</script>

<template>
  <CmsGenericElement
    v-if="slotContent && props.content?.name?.toLowerCase() !== 'introduction'"
    :content="slotContent"
    class="cms-block-text-on-image min-h-md"
  />
  <NuxtLink
    v-else-if="slotContent"
    to="/Women/Clothing/"
    class="cms-block-text-on-image min-h-[80vh] relative"
  >
    <div class="absolute bottom-0 left-1/2 translate -translate-x-1/2 text-white text-center">
      <p class="font-semibold mb-2 uppercase">{{ $t('new_collection') }}</p>
      <p class="text-3xl md:text-4xl mb-8 whitespace-nowrap" v-html="$t('shop_the_new_signature_collection')"></p>
      <button class="mb-16 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-50 py-3 px-6 font-medium">{{ $t('show_collection') }}</button>
    </div>
  </NuxtLink>
</template>
