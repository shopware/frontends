import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
} from "@nuxt/kit";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "shopware-guidance-banner",
    configKey: "shopwareGuidanceBanner",
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    addPlugin(resolver.resolve("./runtime/plugin"));
    addComponentsDir({
      path: resolver.resolve(__dirname, "./runtime/components"),
      pathPrefix: false,
      global: true,
    });
  },
});
