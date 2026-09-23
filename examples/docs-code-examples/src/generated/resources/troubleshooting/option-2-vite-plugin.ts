  import basicSsl from '@vitejs/plugin-basic-ssl'
  // https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
  export default defineNuxtConfig({
  // ...
  devServer: {
    https: true,
  },
  vite: {
    plugins: [
      basicSsl(),
    ],
  },
  // ...
