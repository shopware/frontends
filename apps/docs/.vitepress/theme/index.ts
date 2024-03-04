// import './styles/index.css'
import {SWAGTheme} from "vitepress-shopware-docs";
// Ai component
// import AI from "./components/AI.vue";
import "./custom.css";

export default {
  ...SWAGTheme({
    slots: {
      // banner: () => h(Banner),
      // "content-top": () => h("h1", "We have important Announcement!"),
      // 'sidebar-top': () => h(PreferenceSwitch),
      // 'aside-mid': () => h(SponsorsAside),
      // 'aside-bottom': () => h(VueJobs)
    },
    enhanceApp({app}) {
      // app.component("AI", AI);
      // app.provide('some-injection-key-if-needed', VALUE)
    }
  })
}