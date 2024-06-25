/**
 * Currently devtools are not working in Nuxt 3
 * source: https://github.com/nuxt/framework/issues/4325
 * - we don't need them for now as we do not show any significant info for now
 */

import { effectScope, markRaw, reactive } from "vue";
import type { App, EffectScope } from "vue";
// import { registerShopwareDevtools } from "./devtools/plugin";

export function createShopwareContext(
  app: App,
  options: {
    devStorefrontUrl?: string | null;
    enableDevtools?: boolean;
  },
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
      },
    ) {
      shopwarePlugin._a = app;
      app.config.globalProperties.$shopware = shopwarePlugin;
      app.provide("shopware", shopwarePlugin);
      /* istanbul ignore else */
      if (options?.enableDevtools && typeof window !== "undefined") {
        // registerShopwareDevtools(app, shopwarePlugin);
      }
    },
    _a: app,
    _e: scope,
    devStorefrontUrl: options.devStorefrontUrl,
    state,
  });

  if (options?.enableDevtools && typeof window !== "undefined") {
    // registerShopwareDevtools(app, shopwarePlugin);
  }
  return shopwarePlugin;
}
