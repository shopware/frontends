import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
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

    // Merge with runtimeConfig.amazonPay so values set there (and their NUXT_*
    // environment overrides) are kept.
    nuxt.options.runtimeConfig.amazonPay = defu(
      nuxt.options.runtimeConfig.amazonPay || {},
      moduleOptions,
    );
    // Expose only what the client needs. The merged private config also holds
    // shopwareAdminApi, privateKeyPath and other server-only values, which
    // must never be copied here.
    const { merchantId, sandbox, webCheckoutDetails } =
      nuxt.options.runtimeConfig.amazonPay;
    nuxt.options.runtimeConfig.public.amazonPay = {
      merchantId,
      sandbox,
      webCheckoutDetails,
    };

    const resolver = createResolver(import.meta.url);

    // add server plugin
    addPlugin({
      src: resolver.resolve("./runtime/plugins/amazon-pay"),
      mode: "all",
    });
    // add composables
    addImportsDir(resolver.resolve("./runtime/composables"));
    // add components to the global scope
    addComponentsDir({
      path: resolver.resolve("./runtime/components"),
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
