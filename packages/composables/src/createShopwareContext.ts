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
    ssrWithoutUserContext: options.ssrWithoutUserContext ?? false,
  });

  return shopwarePlugin;
}
