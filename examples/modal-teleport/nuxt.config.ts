// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt"],
  typescript: {
    strict: true,
  },
  vite: {
    build: {
      minify: false,
      sourcemap: false,
    },
  },
  devtools: {
    enabled: false,
  },
  sourcemap: {
    server: false,
    client: false,
  },
  components: {
    dirs: ["~/components"],
    global: true,
  },
  telemetry: false,
});
