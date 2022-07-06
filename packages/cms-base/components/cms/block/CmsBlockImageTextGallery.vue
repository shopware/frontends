<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";
import { CmsBlockImageTextGallery } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageTextGallery;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTextContent = getSlotContent("left-text");
const rightTextContent = getSlotContent("right-text");
const centerTextContent = getSlotContent("center-text");

const leftImageContent = getSlotContent("left-image");
const rightImageContent = getSlotContent("right-image");
const centerImageContent = getSlotContent("center-image");

// TODO: useRouter
function onImageClick(slotContent: CmsSlot) {
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
    class="cms-block-image-text-gallery"
    :style="{ backgroundColor: content.backgroundColor || '' }"
  >
    <div class="cms-block-image-text-gallery__container">
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="leftImageContent"
          :style="{ cursor: leftImageContent.data?.url && 'pointer' }"
          @click.native="onImageClick(leftImageContent)"
        />
        <CmsElementText
          :content="leftTextContent"
          class="cms-block-image-text-gallery__container__column--text"
        />
      </div>
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="centerImageContent"
          :style="{ cursor: centerImageContent.data?.url && 'pointer' }"
          @click.native="onImageClick(centerImageContent)"
        />
        <CmsElementText
          :content="centerTextContent"
          class="cms-block-image-text-gallery__container__column--text"
        />
      </div>
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="rightImageContent"
          :style="{ cursor: rightImageContent.data?.url && 'pointer' }"
          @click.native="onImageClick(rightImageContent)"
        />
        <CmsElementText
          :content="rightTextContent"
          class="cms-block-image-text-gallery__container__column--text"
        />
      </div>
    </div>
  </article>
</template>
