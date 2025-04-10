// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["../core"],
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
