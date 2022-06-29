<template>
  <article class="grid md:grid-cols-3 gap-4">
    <CmsGenericElement :content="getLeftContent" class="" />
    <CmsGenericElement :content="getCenterContent" class="" />
    <CmsGenericElement :content="getRightContent" class="" />
  </article>
</template>

<script>
// import CmsGenericElement from "sw-cms/CmsGenericElement";

export default {
  name: "CmsBlockTextThreeColumn",

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
