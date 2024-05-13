import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
} from "@nuxt/kit";
import defu from "defu";

export default defineNuxtModule({
  meta: {
    name: "@shopware/amazon-pay",
    configKey: "amazonPay",
  },
  setup(_, nuxt) {
    const options = nuxt.options?.amazonPay || {};
    // copy options to runtimeConfig
    nuxt.options.runtimeConfig.public.amazonPay = defu({}, options);

    const resolver = createResolver(import.meta.url);
    // add server plugin
    addPlugin({
      src: resolver.resolve(
        __dirname,
        "./runtime/plugins/amazon-pay.server.ts",
      ),
      mode: "server",
    });
    // add composables
    addImportsDir(resolver.resolve(__dirname, "./runtime/composables"));
    // add components to the global scope
    addComponentsDir({
      path: resolver.resolve(__dirname, "./runtime/components"),
      global: true,
    });
  },
});
