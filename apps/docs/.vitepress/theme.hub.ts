import ComposablesList from "./theme/components/ComposablesList.vue";
import ColorDesignTokens from "./theme/components/ColorDesignTokens.vue";

export default ({ app }) => {
  app.component("ComposablesList", ComposablesList);
  app.component("ColorDesignTokens", ColorDesignTokens);
};
