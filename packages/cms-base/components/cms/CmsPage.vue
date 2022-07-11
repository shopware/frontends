<script>
import { resolveComponent } from "vue";
import { pascalCase } from "scule";

export default {
  name: "CmsPage",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    cmsSections() {
      return this.content?.sections || this.content?.cmsPage?.sections || [];
    },
  },
  render() {
    const sections = this.cmsSections;
    const componentsMap = sections.map((section) => {
      return {
        component: resolveComponent(`CmsSection${pascalCase(section.type)}`),
        section: section,
      };
    });
    return componentsMap.map((componentObject) => {
      if (typeof componentObject.component === "string")
        return h("div", {}, "There is no " + componentObject.component); // TODO: cmsNoComponent
      return h(componentObject.component, {
        content: componentObject.section,
        style: {
          backgroundColor: componentObject.section.backgroundColor,
        },
      });
    });
  },
};
</script>

<style></style>
