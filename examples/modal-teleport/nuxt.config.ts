// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@unocss/nuxt"],
  typescript: {
    strict: true,
  },
  components: {
    dirs: ["~/components"],
    global: true,
  },
  nitro: {
    compressPublicAssets: true,
  },
  telemetry: false,
});
