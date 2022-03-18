<script>
// import { getCmsBlockComponent } from "sw-cms/cmsNameMapper";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
// import { computed } from "@vue/composition-api";
// import SwPluginSlot from "sw-plugins/SwPluginSlot.vue";

export default {
  name: "CmsGenericElement",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { attrs }) {
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

      const cmsPageView = resolveComponent(componentNameToResolve);

      if (cmsPageView) {
        if (cmsPageView === componentNameToResolve)
          return h(
            "div",
            {},
            "Problem resolving component: " + componentNameToResolve
          );
        return h(cmsPageView, { content: props.content });
      }
    };
  },
};
</script>
