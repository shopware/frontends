import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
} from "@nuxt/kit";
import { defu } from "defu";

/**
 * Module options
 */
export type AmazonPayModuleOptions = {
  storeId: string;
  publicKeyId: string;
  privateKeyPath: string;
  region: "DE" | "UK" | "US";
  merchantId: string;
  sandbox: boolean;
  algorithm: "AMZN-PAY-RSASSA-PSS-V2";
  webCheckoutDetails: {
    checkoutReviewReturnUrl: string;
    checkoutResultReturnUrl: string;
  };
  shopwareAdminApi: {
    endpoint: string;
    credentials: {
      client_id: string;
      client_secret: string;
    };
  };
};

declare module "@nuxt/schema" {
  interface NuxtOptions {
    amazonPay: AmazonPayModuleOptions;
  }

  interface NuxtConfig {
    amazonPay?: AmazonPayModuleOptions;
  }

  interface RuntimeConfig {
    amazonPay: AmazonPayModuleOptions;
  }
  interface PublicRuntimeConfig {
    amazonPay: Pick<
      AmazonPayModuleOptions,
      "merchantId" | "sandbox" | "webCheckoutDetails"
    >;
  }
}

export default defineNuxtModule<AmazonPayModuleOptions>({
  meta: {
    name: "@shopware/amazon-pay",
    configKey: "amazonPay",
  },
  async setup(options, nuxt) {
    const moduleOptions = options;

    nuxt.options.runtimeConfig.amazonPay = defu({}, moduleOptions);
    // copy options to public runtimeConfig
    nuxt.options.runtimeConfig.public.amazonPay = defu(
      {},
      {
        merchantId: moduleOptions.merchantId,
        sandbox: moduleOptions.sandbox,
        webCheckoutDetails: moduleOptions.webCheckoutDetails,
      },
    );

    const resolver = createResolver(import.meta.url);

    // add server plugin
    addPlugin({
      src: resolver.resolve(__dirname, "./runtime/plugins/amazon-pay"),
      mode: "all",
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
  },
});
