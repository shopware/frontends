<script>
// import { getCmsBlockComponent } from "sw-cms/cmsNameMapper";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
// import { computed } from "@vue/composition-api";
// import SwPluginSlot from "sw-plugins/SwPluginSlot.vue";

export default {
  name: "CmsGenericBlock",
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
    // const getComponent = computed(() => getCmsBlockComponent(content));

    return () => {
      const componentName = props.content.type;
      const apiAlias = props.content.apiAlias;
      const type =
        apiAlias === "cms_section"
          ? "Section"
          : apiAlias === "cms_block"
          ? "Block"
          : "Element";
      const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
      try {
        const cmsPageView = resolveComponent(componentNameToResolve);

        console.error(
          "coname",
          apiAlias,
          componentName,
          "type",
          type,
          "tores",
          componentNameToResolve,
          "RESOLVED",
          typeof cmsPageView !== "string"
        );

        if (cmsPageView) {
          if (cmsPageView === componentNameToResolve)
            return h(
              "div",
              {},
              "Problem resolving component: " + componentNameToResolve
            );
          return h("div", h(cmsPageView, { content: props.content }));
        }
        return h("div", {}, "Loading...");
      } catch (e) {
        console.error(
          "Problem Resolving",
          componentNameToResolve,
          ":",
          e.message
        );
        return h("div", {}, `Problem(${componentNameToResolve}): ${e.message}`);
      }
    };
  },
};
</script>
