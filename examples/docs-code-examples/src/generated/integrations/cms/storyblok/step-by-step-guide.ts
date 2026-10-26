import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["@shopware/nuxt-module", "@storyblok/nuxt"],
  storyblok: {
    accessToken: "super-secret-token",
  },
});
