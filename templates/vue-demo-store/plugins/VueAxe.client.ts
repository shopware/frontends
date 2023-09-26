import plugin, { VueAxePopup } from "vue-axe";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  if (config.public.env === "development") {
    nuxtApp.vueApp.component("VueAxePopup", VueAxePopup);
    nuxtApp.vueApp.use(plugin, {
      auto: true,
    });
  } else {
    nuxtApp.vueApp.component("vue-axe-popup", h("div"));
  }
});
