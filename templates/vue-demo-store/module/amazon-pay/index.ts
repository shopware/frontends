import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  extendPages,
} from "@nuxt/kit";
import defu from "defu";

export default defineNuxtModule({
  meta: {
    name: "@shopware/amazon-pay",
    configKey: "amazonPay",
  },
  setup(options, nuxt) {
    const moduleOptions = options?.amazonPay || {};
    // copy options to runtimeConfig
    nuxt.options.runtimeConfig.public.amazonPay = defu({}, moduleOptions);

    const resolver = createResolver(import.meta.url);
    // add server plugin
    addPlugin({
      src: resolver.resolve(__dirname, "./runtime/plugins/amazon-pay.server"),
      mode: "server",
    });
    // add composables
    addImportsDir(resolver.resolve(__dirname, "./runtime/composables"));
    // add components to the global scope
    addComponentsDir({
      path: resolver.resolve(__dirname, "./runtime/components"),
      global: true,
    });

    addServerHandler({
      handler: resolver.resolve("./runtime/server/api/amazon-pay/init.get"),
      route: "/api/amazon-pay/init",
    });

    addServerHandler({
      handler: resolver.resolve("./runtime/server/api/amazon-pay/session.get"),
      route: "/api/amazon-pay/session",
    });

    addServerHandler({
      handler: resolver.resolve("./runtime/server/api/amazon-pay/pay.post"),
      method: "post",
      route: "/api/amazon-pay/pay",
    });

    addServerHandler({
      handler: resolver.resolve(
        "./runtime/server/api/amazon-pay/complete.post",
      ),
      method: "post",
      route: "/api/amazon-pay/complete",
    });

    extendPages((pages) => {
      pages.push({
        path: "/checkout/amazon-pay",
        file: resolver.resolve(__dirname, "./pages/checkout-amazon-pay.vue"),
      });

      pages.push({
        path: "/checkout/amazon-pay/complete",
        file: resolver.resolve(__dirname, "./pages/complete.vue"),
      });
    });
  },
});
