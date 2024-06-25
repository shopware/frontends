<script setup lang="ts">
import type { Schemas } from "#shopware";
import type {
  CmsBlockImageTextGallery,
  CmsElementImage,
  CmsElementText,
} from "@shopware-pwa/composables-next";
import { useCmsBlock } from "#imports";

const props = defineProps<{
  content: CmsBlockImageTextGallery;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTextContent = getSlotContent("left-text") as CmsElementText;
const rightTextContent = getSlotContent("right-text") as CmsElementText;
const centerTextContent = getSlotContent("center-text") as CmsElementText;

const leftImageContent = getSlotContent("left-image") as CmsElementImage;
const rightImageContent = getSlotContent("right-image") as CmsElementImage;
const centerImageContent = getSlotContent("center-image") as CmsElementImage;

// TODO: useRouter
function onImageClick(
  slotContent: Omit<Schemas["CmsSlot"], "data"> & { data: any },
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
    class="cms-block-image-text-gallery"
    :style="{ backgroundColor: content.backgroundColor || '' }"
  >
    <div class="cms-block-image-text-gallery__container">
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="leftImageContent"
          :style="{ cursor: (leftImageContent.data as any)?.url && 'pointer' }"
          @click.native="onImageClick(leftImageContent as any)"
        />
        <CmsElementText
          :content="leftTextContent"
          class="cms-block-imag)e-text-gallery__container__column--text"
        />
      </div>
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="centerImageContent"
          :style="{
            cursor: (centerImageContent.data as any)?.url && 'pointer',
          }"
          @click.native="onImageClick(centerImageContent as any)"
        />
        <CmsElementText
          :content="centerTextContent"
          class="cms-block-image-text-gallery__container__column--text"
        />
      </div>
      <div class="cms-block-image-text-gallery__container__column">
        <CmsElementImage
          :content="rightImageContent"
          :style="{ cursor: (rightImageContent.data as any)?.url && 'pointer' }"
          @click.native="onImageClick(rightImageContent as any)"
        />
        <CmsElementText
          :content="rightTextContent"
          class="cms-block-image-text-gallery__container__column--text"
        />
      </div>
    </div>
  </article>
</template>
