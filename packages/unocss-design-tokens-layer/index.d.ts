/// <reference types="@nuxt/schema" />

export {};

declare module "nuxt/schema" {
  interface AppConfig extends CmsBaseLayerAppConfig {}
  interface AppConfigInput extends CmsBaseLayerAppConfig {}
}

declare module "@nuxt/schema" {
  interface AppConfig extends CmsBaseLayerAppConfig {}
  interface AppConfigInput extends CmsBaseLayerAppConfig {}
}
