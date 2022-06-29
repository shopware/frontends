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
    const rawHtml = computed(
      () =>
        props.content?.data?.content ?? props.content?.config?.content?.value
    );
    return () => {
      return h("div", { innerHTML: rawHtml.value });
    };
  },
};
</script>
<!-- <template>
  {{content}}
</template> -->
