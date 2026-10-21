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
    browserLocale?: string;
    /**
     * Opt in to cacheable GET Store API reads. Only a session that looks like
     * a fresh default guest uses GET. Every other session stays on POST.
     *
     * @default false
     */
    cacheableReads?: boolean;
    /**
     * Server render without the visitor's session. Every request is a fresh
     * default session. The Nuxt module sets it when `useUserContextInSSR` is
     * off.
     *
     * @default false
     */
    ssrWithoutUserContext?: boolean;
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
    install(app: App) {
      shopwarePlugin._a = app;
      app.config.globalProperties.$shopware = shopwarePlugin;
      app.provide("shopware", shopwarePlugin);
    },
    _a: app,
    _e: scope,
    devStorefrontUrl: options.devStorefrontUrl,
    state,
    browserLocale: options.browserLocale || "en-US",
    cacheableReads: options.cacheableReads ?? false,
    ssrWithoutUserContext: options.ssrWithoutUserContext ?? false,
  });

  if (options?.enableDevtools && typeof window !== "undefined") {
    // registerShopwareDevtools(app, shopwarePlugin);
  }
  return shopwarePlugin;
}
