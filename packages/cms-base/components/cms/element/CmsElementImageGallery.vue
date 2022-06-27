<template>
  <SwProductGallery :product="product" />
</template>

<script>
import { useCms } from "@shopware-pwa/composables-next";
import SwProductGallery from "../../SwProductGallery.vue";

export default {
  name: "CmsElementImageGallery",

  components: {
    SwProductGallery,
  },

  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const { cmsContent } = useCms();
    const product = computed(() => cmsContent.value?.product);

    return {
      product,
    };
  },
};
</script>

<style lang="scss" scoped></style>
