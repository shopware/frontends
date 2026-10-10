declare module "@nuxt/schema" {
  interface NuxtConfig {
    sanity?: Record<string, unknown>;
    storyblok?: Record<string, unknown>;
  }
}

export {};
