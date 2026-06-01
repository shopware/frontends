# @shopware/unocss-design-tokens-layer

Nuxt layer that provides the shared Shopware Frontends UnoCSS setup, design tokens, reset stylesheet, and runtime support for resolving dynamic utility classes.

It is intended to be composed with layers such as `@shopware/cms-base-layer`, while allowing projects to keep design tokens separate from CMS functionality.

## Usage

```ts
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer",
    "@shopware/unocss-design-tokens-layer",
  ],
  modules: ["@shopware/nuxt-module", "@unocss/nuxt"],
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
});
```

## Customization

Extend the generated base Uno config in your project:

```ts
import { mergeConfigs } from "@unocss/core";
import baseConfig from "./.nuxt/uno.config.mjs";

export default mergeConfigs([baseConfig, {
  theme: {
    colors: {
      "brand-primary": "#123456",
    },
  },
}]);
```
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/unocss-design-tokens-layer/CHANGELOG.md)

### Latest changes: 1.0.0

### Major Changes

- [#2433](https://github.com/shopware/frontends/pull/2433) [`5255cd5`](https://github.com/shopware/frontends/commit/5255cd5c09bed33ae18e05ac35a6f22810ca668d) Thanks [@patzick](https://github.com/patzick)! - Package release

### Minor Changes

- [#2406](https://github.com/shopware/frontends/pull/2406) [`df93461`](https://github.com/shopware/frontends/commit/df93461434cb79ec9d722cdbd42a37a9af07fb03) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Publish the Nuxt layer that provides shared UnoCSS presets, Shopware design tokens, and the UnoCSS runtime plugin for dynamic CMS utility classes.
