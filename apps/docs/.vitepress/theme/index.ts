// import './styles/index.css'
import { App } from "vue";
import { SWAGTheme } from "vitepress-shopware-docs";
import PageRef from "./components/PageRef.vue";
import DemoBlock from "./components/DemoBlock.vue";
import CreateContext from "./components/CreateContext.vue";
// Ai component
// import AI from "./components/AI.vue";
import "./custom.css";

export default Object.assign(
  {
    ...SWAGTheme(),
  },
  {
    enhanceApp({ app }: { app: App }) {
      app.component("PageRef", PageRef);
      app.component("DemoBlock", DemoBlock);
      app.component("CreateContext", CreateContext);
      // app.component("AI", AI);
      // app.provide('some-injection-key-if-needed', VALUE)
    },
  },
);
