import { SWAGTheme } from "vitepress-shopware-docs";
// import './styles/index.css'
import type { App } from "vue";
// Ai component
// import AI from "./components/AI.vue";
import PageRef from "./components/PageRef.vue";
import "./custom.css";

export default Object.assign(
  {
    ...SWAGTheme(),
  },
  {
    enhanceApp({ app }: { app: App }) {
      // app.component("AI", AI);
      app.component("PageRef", PageRef);
      // app.provide('some-injection-key-if-needed', VALUE)
    },
  },
);
