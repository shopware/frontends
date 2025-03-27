// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
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
  imports: {
    dirs: ["./composables"],
    global: true,
  },
});
