<script setup lang="ts">
import type {
  CmsBlockImageTextGallery,
  CmsElementImage,
  CmsElementText,
} from "@shopware/composables";
import { computed } from "vue";

import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextGallery;
}>();

const { getSlotContent } = useCmsBlock(() => props.content);

const leftTextContent = computed(
  () => getSlotContent("left-text") as CmsElementText | undefined,
);
const rightTextContent = computed(
  () => getSlotContent("right-text") as CmsElementText | undefined,
);
const centerTextContent = computed(
  () => getSlotContent("center-text") as CmsElementText | undefined,
);

const leftImageContent = computed(
  () => getSlotContent("left-image") as unknown as CmsElementImage | undefined,
);
const rightImageContent = computed(
  () => getSlotContent("right-image") as unknown as CmsElementImage | undefined,
);
const centerImageContent = computed(
  () =>
    getSlotContent("center-image") as unknown as CmsElementImage | undefined,
);

// TODO: useRouter
function onImageClick(
  slotContent: CmsElementImage & {
    data: {
      url?: string;
      newTab?: boolean;
    };
  },
) {
  if (slotContent.data?.url) {
    if (slotContent.data?.newTab) {
      window.open(slotContent.data.url);
    } else {
      window.location.href = slotContent.data.url;
    }
  }
}
</script>
<template>
  <article
    class="cms-block-image-text-gallery flex flex-col sm:flex-row justify-start items-start gap-6 w-full"
    :style="{ backgroundColor: content.backgroundColor || '' }"
  >
    <div class="w-full sm:flex-1">
      <CmsElementImage
        v-if="leftImageContent"
        :content="leftImageContent"
        :style="{ cursor: leftImageContent.data?.url && 'pointer' }"
        @click="onImageClick(leftImageContent)"
      />
      <CmsElementText
        v-if="leftTextContent"
        :content="leftTextContent"
        class="self-stretch"
      />
    </div>
    <div class="w-full sm:flex-1">
      <CmsElementImage
        v-if="centerImageContent"
        :content="centerImageContent"
        :style="{
          cursor: centerImageContent.data?.url && 'pointer',
        }"
        @click="onImageClick(centerImageContent)"
      />
      <CmsElementText
        v-if="centerTextContent"
        :content="centerTextContent"
        class="self-stretch"
      />
    </div>
    <div class="w-full sm:flex-1">
      <CmsElementImage
        v-if="rightImageContent"
        :content="rightImageContent"
        :style="{ cursor: rightImageContent.data?.url && 'pointer' }"
        @click="onImageClick(rightImageContent)"
      />
      <CmsElementText
        v-if="rightTextContent"
        :content="rightTextContent"
        class="self-stretch"
      />
    </div>
  </article>
</template>
