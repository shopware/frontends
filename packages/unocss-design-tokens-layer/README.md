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

export default mergeConfigs([
  baseConfig,
  {
    theme: {
      colors: {
        "brand-primary": "#123456",
      },
    },
  },
]);
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/unocss-design-tokens-layer/CHANGELOG.md)

### Latest changes: 1.0.2

### Patch Changes

- [#2632](https://github.com/shopware/frontends/pull/2632) [`9274aa8`](https://github.com/shopware/frontends/commit/9274aa86b8b4c6741fb45c595e239e6f733284db) Thanks [@mkucmus](https://github.com/mkucmus)! - Load `presetWind3` from `@unocss/preset-wind3` instead of the `unocss` barrel in
  `uno.runtime.config.ts`.

  That file is imported by a client plugin, and the barrel statically re-exports
  `@unocss/transformer-attributify-jsx`. That transformer depends on `oxc-parser`, whose
  browser entry imports `@oxc-parser/binding-wasm32-wasi`. The binding is not present in a
  production install, so the client bundle failed to build:

  ```
  [vite]: Rolldown failed to resolve import "@oxc-parser/binding-wasm32-wasi"
  from "oxc-parser/src-js/wasm.js"
  ```

  The parser never runs in the browser. Importing the preset directly keeps it out of the
  client graph and also stops a 1.4 MB `.wasm` file and its worker from being emitted into
  the public bundle.
