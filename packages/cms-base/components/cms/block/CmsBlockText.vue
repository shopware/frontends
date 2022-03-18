<template>
  <div>
    <CmsGenericElement
      v-for="slot in getSlots"
      :key="slot._uniqueIdentifier"
      :content="slot"
      class="cms-block-text"
    />
  </div>
</template>

<script>
// import CmsGenericElement from "sw-cms/CmsGenericElement";

export default {
  name: "CmsBlockText",

  components: {
    // CmsGenericElement,
  },

  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getSlots() {
      return this.content.slots || [];
    },
  },
};
// <style lang="scss" scoped>
// @import "@/cms/settings.scss";

// .cms-block-default {
//   @include sizing-mode-boxed;
// }
// </style>
</script>
