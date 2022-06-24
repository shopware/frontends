<template>
  <div class="products-recomendations">cross sells</div>
</template>

<script>
import { computed } from "@vue/composition-api";

export default {
  name: "CmsElementProductCrossSelling",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const crossSellCollection = computed(
      () => props.content.data?.crossSellings || []
    );

    return {
      crossSellCollection,
    };
  },
};
</script>

<style lang="scss" scoped></style>
