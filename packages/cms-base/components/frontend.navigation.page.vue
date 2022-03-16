<template>
  <CmsPage :content="cmsPage" />
</template>
<script>
export default {
  name: "FrontendNavigationPage",
  props: {
    cmsPage: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="scss" scoped></style>
