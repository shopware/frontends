import vueAxe from "vue-axe";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  if (config.public.env === "development") {
    nuxtApp.vueApp.component("VueAxePopup", vueAxe.VueAxePopup);
    nuxtApp.vueApp.use(vueAxe.default, {
      auto: false,
    });
  } else {
    nuxtApp.vueApp.component("VueAxePopup", h("div"));
  }
});
