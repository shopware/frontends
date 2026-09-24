import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/guide/directory-structure/nuxt-config
export default defineNuxtConfig({
  devServer: {
    https: true,
  },
  vite: {
    plugins: [basicSsl()],
  },
});
