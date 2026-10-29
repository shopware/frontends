// Docs snippets configure @nuxtjs/sanity and @storyblok/nuxt, which this project does not install.
declare module "@nuxt/schema" {
  interface NuxtConfig {
    sanity?: Record<string, unknown>;
    storyblok?: Record<string, unknown>;
  }
}

export {};
