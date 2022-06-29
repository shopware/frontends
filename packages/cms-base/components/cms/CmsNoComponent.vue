<template>
  <span class="sw-text-error">
    <b>
      {{ elementType }}<i> {{ getElementType }} </i>
    </b>
    is not implemented yet!
  </span>
</template>

<script>
export default {
  name: "CmsNoComponent",
  components: {},
  props: {
    content: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    elementType() {
      if (this.content.pageId) return "Section";
      return this.content.sectionId ? `Block` : `Slot`;
    },
    getElementType() {
      return this.content ? this.content.type : "";
    },
  },
};
</script>
