import { SWAGTheme } from "vitepress-shopware-docs";
import ColorDesignTokens from "./components/ColorDesignTokens.vue";
import TryItOutPicker from "./components/TryItOutPicker.vue";
import "./custom.css";

export default SWAGTheme({
  enhanceApp({ app }) {
    app.component("ColorDesignTokens", ColorDesignTokens);
    app.component("TryItOutPicker", TryItOutPicker);
  },
});
