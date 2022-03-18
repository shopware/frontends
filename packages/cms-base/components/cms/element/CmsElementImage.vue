<template>
  <img :src="imgUrl" />
</template>

<script>
import { getCmsLink, getCmsLinkTarget } from "@shopware-pwa/helpers";

export default {
  name: "CmsElementImage",

  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    alt() {
      return (this.getMedia && this.getMedia.alt) || " ";
    },

    getMedia() {
      return this.content && this.content.data && this.content.data.media;
    },

    imgUrl() {
      // return getResizedImage(this.getMedia && this.getMedia.url);
      return this.getMedia?.url;
    },

    lazyLoad() {
      return "lazy";
    },

    link() {
      return getCmsLink(this.content);
    },

    title() {
      return this.getMedia && this.getMedia.title;
    },

    target() {
      return getCmsLinkTarget(this.content);
    },
  },
};
// <style lang="scss" scoped>
// @import "@/cms/settings.scss";

// .cms-element-image {
//   --image-width: 100%;
//   width: 100%;
// }
// </style>
</script>
