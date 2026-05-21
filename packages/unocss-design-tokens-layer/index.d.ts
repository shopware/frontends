/// <reference types="@nuxt/schema" />

export * from "./.nuxt/imports";

declare module "nuxt/schema" {
  interface AppConfig extends CmsBaseLayerAppConfig {}
  interface AppConfigInput extends CmsBaseLayerAppConfig {}
}

declare module "@nuxt/schema" {
  interface AppConfig extends CmsBaseLayerAppConfig {}
  interface AppConfigInput extends CmsBaseLayerAppConfig {}
}
