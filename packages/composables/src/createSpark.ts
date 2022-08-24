/**
 * Currently devtools are not working in Nuxt 3
 * source: https://github.com/nuxt/framework/issues/4325
 * - we don't need them for now as we do not show any significant info for now
 */

import { ShopwareApiInstance } from "@shopware-pwa/shopware-6-client";
import { App, effectScope, EffectScope, markRaw, reactive } from "vue";
// import { registerShopwareDevtools } from "./devtools/plugin";

export function createSpark(
  app: App,
  options: {
    // initialStore?: any;
    // shopwareDefaults: ApiDefaults;
    apiInstance: ShopwareApiInstance;
    enableDevtools?: boolean;
  }
) {
  const scope: EffectScope = effectScope(true);
  const state = scope.run(() => {
    return reactive({
      interceptors: {},
      // sharedStore: options.initialStore || reactive({}),
      // shopwareDefaults: options.shopwareDefaults || {},
    });
  });

  const shopwarePlugin = markRaw({
    install(
      app: App,
      options?: {
        enableDevtools: boolean;
      }
    ) {
      shopwarePlugin._a = app;
      (app as any).config.globalProperties.$shopware = shopwarePlugin;
      (app as any).provide("shopware", shopwarePlugin);
      /* istanbul ignore else */
      if (options?.enableDevtools && typeof window !== "undefined") {
        // registerShopwareDevtools(app, shopwarePlugin);
      }
    },
    _a: app,
    _e: scope,
    apiInstance: options.apiInstance,
    state,
  });

  if (options?.enableDevtools && typeof window !== "undefined") {
    // registerShopwareDevtools(app, shopwarePlugin);
  }
  return shopwarePlugin as any;
}
