<template>
  <div>
    <CmsGenericBlock
      v-for="cmsBlock in getBlocks"
      :key="cmsBlock.id"
      :content="cmsBlock"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "CmsSectionSidebar",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getBlocks() {
      return this.content.blocks || [];
    },
    cmsClass() {
      return this.content?.cssClass;
    },
    isSizingModeBoxed() {
      return this.content.sizingMode === "boxed";
    },
    sectionStyles() {
      const {
        backgroundColor,
        backgroundMedia,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
      } = this.content;
      return {
        backgroundColor,
        backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
      };
    },
  },
};
</script>
