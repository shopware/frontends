/// <reference types="@nuxt/schema" />

export * from "@shopware/composables";
export * from "./.nuxt/imports";

declare module "nuxt/schema" {
  interface AppConfig {
    imagePlaceholder?: {
      color?: string;
    };
  }
}
