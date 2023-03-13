// import './styles/index.css'
import { h, App } from "vue";
import { VPTheme } from "vitepress-shopware-docs";
import PageRef from "./components/PageRef.vue";
// Ai component
// import AI from "./components/AI.vue";
import "./custom.css";

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {
      // banner: () => h(Banner),
      // "content-top": () => h("h1", "We have important Announcement!"),
      // 'sidebar-top': () => h(PreferenceSwitch),
      // 'aside-mid': () => h(SponsorsAside),
      // 'aside-bottom': () => h(VueJobs)
    });
  },
  enhanceApp({ app }: { app: App }) {
    app.component("PageRef", PageRef);
    // app.component("AI", AI);
    // app.provide('some-injection-key-if-needed', VALUE)
  },
});
