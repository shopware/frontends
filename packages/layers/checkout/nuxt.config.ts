// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ["../core", "../cart"],
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
