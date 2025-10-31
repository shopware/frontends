<script setup lang="ts">
import type {
  CmsBlockImageTextGallery,
  CmsElementImage,
  CmsElementText,
} from "@shopware/composables";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextGallery;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTextContent = getSlotContent("left-text") as CmsElementText;
const rightTextContent = getSlotContent("right-text") as CmsElementText;
const centerTextContent = getSlotContent("center-text") as CmsElementText;

const leftImageContent = getSlotContent(
  "left-image",
) as unknown as CmsElementImage;
const rightImageContent = getSlotContent(
  "right-image",
) as unknown as CmsElementImage;
const centerImageContent = getSlotContent(
  "center-image",
) as unknown as CmsElementImage;

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
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsElementImage
        :content="leftImageContent"
        :style="{ cursor: leftImageContent.data?.url && 'pointer' }"
        @click="onImageClick(leftImageContent)"
      />
      <CmsElementText
        :content="leftTextContent"
        class="self-stretch"
      />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsElementImage
        :content="centerImageContent"
        :style="{
          cursor: centerImageContent.data?.url && 'pointer',
        }"
        @click="onImageClick(centerImageContent)"
      />
      <CmsElementText
        :content="centerTextContent"
        class="self-stretch"
      />
    </div>
    <div class="w-full sm:flex-1 flex flex-col justify-center items-start gap-4">
      <CmsElementImage
        :content="rightImageContent"
        :style="{ cursor: rightImageContent.data?.url && 'pointer' }"
        @click="onImageClick(rightImageContent)"
      />
      <CmsElementText
        :content="rightTextContent"
        class="self-stretch"
      />
    </div>
  </article>
</template>
