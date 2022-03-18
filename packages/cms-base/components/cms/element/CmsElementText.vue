<script>
export default {
  name: "CmsElementText",
  functional: true,
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      return h("div", { innerHTML: props.content.data.content });
    };
  },
};
</script>
