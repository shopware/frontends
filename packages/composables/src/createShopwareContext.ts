import { effectScope, markRaw, reactive } from "vue";
import type { App, EffectScope } from "vue";

export function createShopwareContext(
  app: App,
  options: {
    devStorefrontUrl?: string | null;
    /**
     * @deprecated Has no effect and will be removed in the next major release.
     */
    enableDevtools?: boolean;
    browserLocale?: string;
    /**
     * Opt in to reading data via cacheable GET Store API routes instead of
     * POST. Surfaced on the Shopware context as `cacheableReads`.
     *
     * @default false
     */
    cacheableReads?: boolean;
  },
) {
  const scope: EffectScope = effectScope(true);
  const state = scope.run(() => {
    return reactive({
      interceptors: {},
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
    /**
     * @deprecated Not read by any composable and will be removed in the next major release.
     */
    state,
    browserLocale: options.browserLocale || "en-US",
    cacheableReads: options.cacheableReads ?? false,
  });

  return shopwarePlugin;
}
