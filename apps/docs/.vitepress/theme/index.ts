// import './styles/index.css'
import { App } from "vue";
import { SWAGTheme } from "vitepress-shopware-docs";
// Ai component
// import AI from "./components/AI.vue";
import "./custom.css";

export default Object.assign(
  {
    ...SWAGTheme(),
  },
  {
    enhanceApp({ app }: { app: App }) {
      // app.component("AI", AI);
      // app.provide('some-injection-key-if-needed', VALUE)
    },
  },
);
