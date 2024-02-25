import {
  defineNuxtModule,
  addImports,
  createResolver,
  addPlugin,
  addComponentsDir,
} from "@nuxt/kit";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  setup() {
    const resolver = createResolver(import.meta.url);
    addComponentsDir({
      path: resolver.resolve("components"),
    });

    addImports([
      {
        name: "useUnzer",
        from: resolver.resolve("./composables/useUnzer"),
      },
    ]);

    addPlugin(resolver.resolve("./runtime/handle-payment"));
  },
});
