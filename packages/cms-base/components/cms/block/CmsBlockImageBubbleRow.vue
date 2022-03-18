<template>
  <article class="grid grid-cols-3 gap-4 content-center">
    <div class="flex justify-center">
      <CmsGenericElement
        :content="getLeftContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
    <div class="flex justify-center">
      <CmsGenericElement
        :content="getCenterContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
    <div class="flex justify-center">
      <CmsGenericElement
        :content="getRightContent"
        class="rounded-full"
        style="height: calc(100vw / 3 - 64px); width: calc(100vw / 3 - 64px)"
      />
    </div>
  </article>
</template>

<script>
// import CmsGenericElement from "sw-cms/CmsGenericElement";

export default {
  name: "CmsBlockImageBubbleRow",

  components: {
    // CmsGenericElement,
  },

  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {};
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
// <style lang="scss" scoped>
// @import "@/cms/settings.scss";

// ::v-deep.cms-block-image-bubble-row {
//   display: grid;
//   grid-gap: var(--spacer-sm);
//   grid-template-rows: repeat(3, 286px);
//   margin: var(--spacer-sm);

//   &__image,
//   .cms-element-image {
//     align-items: center;
//     box-sizing: border-box;
//     display: flex;
//     justify-content: center;

//     img {
//       border-radius: 50%;
//       height: 250px;
//       object-fit: cover;
//       object-position: center;
//       width: 250px;
//     }
//   }

//   @include for-desktop {
//     grid-template-columns: repeat(3, 1fr);
//     grid-template-rows: repeat(1, 286px);
//     margin: var(--spacer-sm) 0;
//   }
// }
// </style>
</script>
