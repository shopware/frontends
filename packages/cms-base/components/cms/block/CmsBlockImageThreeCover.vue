<template>
  <article class="grid md:grid-cols-3">
    <CmsGenericElement
      :content="getLeftContent"
      class="aspect-square"
    />
    <CmsGenericElement
      :content="getCenterContent"
      class="aspect-square"
    />
    <CmsGenericElement
      :content="getRightContent"
      class="aspect-square"
    />
  </article>
</template>

<script>
// import CmsGenericElement from "sw-cms/CmsGenericElement";

export default {
  name: "CmsBlockImageThreeCover",

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
    getLeftContent() {
      return this.getSlots.find(({ slot }) => slot === "left");
    },
    getCenterContent() {
      return this.getSlots.find(({ slot }) => slot === "center");
    },
    getRightContent() {
      return this.getSlots.find(({ slot }) => slot === "right");
    },
  },
};
</script>
