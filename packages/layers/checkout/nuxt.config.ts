// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  devtools: { enabled: true },
  components: {
    dirs: [
      {
        path: "./components",
        priority: 10,
      },
    ],
    global: true,
  },
});
