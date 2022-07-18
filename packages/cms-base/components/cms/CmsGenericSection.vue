<script lang="ts">
// import { getCmsSectionComponent } from "sw-cms/cmsNameMapper";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";
import { resolveComponent } from "vue";
// import { computed } from "@vue/composition-api";
// import SwPluginSlot from "sw-plugins/SwPluginSlot.vue";

export default {
  name: "CmsGenericSection",
  // components: { SwPluginSlot },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, {}) {
    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
      props.content
    );
    const cmsClass = computed(() => cssClasses);
    const cmsStyles = computed(() => layoutStyles);
    // const getComponent = computed(
    //   () => import("~/components/cms/CmsGenericBlock.vue")
    // );

    return {
      // getComponent,
      cmsClass,
      cmsStyles,
    };
  },
  render() {
    const CmsGenericBlock = resolveComponent("CmsGenericBlock");
    return h(CmsGenericBlock, {});
  },
};
</script>
