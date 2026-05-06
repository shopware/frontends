import {
  defineNuxtModule,
  addPlugin,
  createResolver,
} from '@nuxt/kit'

export type ModuleOptions = Record<string, never>

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'shopware-guidance-banner',
    configKey: 'shopwareGuidanceBanner',
  },
  defaults: {},
  setup(_options, nuxt) {
    if (!nuxt.options.dev) {
      return
    }

    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve('./runtime/plugin.client'))
  },
})
