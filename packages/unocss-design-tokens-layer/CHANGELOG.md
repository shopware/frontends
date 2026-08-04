# @shopware/unocss-design-tokens-layer

## 1.0.1

### Patch Changes

- [#2596](https://github.com/shopware/frontends/pull/2596) [`6572aa8`](https://github.com/shopware/frontends/commit/6572aa84431e1f4a34d6cf04e549037692d638a6) Thanks [@patzick](https://github.com/patzick)! - Reduce Rolldown/Vite build noise: scope Nuxt global components, keep the three.js async chunk warning intentional, avoid shipping full carbon icon JSON via UnoCSS runtime, and bump @vueuse to 14.4.0.

- [#2543](https://github.com/shopware/frontends/pull/2543) [`7cdb81f`](https://github.com/shopware/frontends/commit/7cdb81f40dc5194432560752718048c730857ddf) Thanks [@patzick](https://github.com/patzick)! - Export the shared UnoCSS config and lazy-load the optional runtime so layered templates can merge the package config directly while keeping runtime generation disabled unless requested.

## 1.0.0

### Major Changes

- [#2433](https://github.com/shopware/frontends/pull/2433) [`5255cd5`](https://github.com/shopware/frontends/commit/5255cd5c09bed33ae18e05ac35a6f22810ca668d) Thanks [@patzick](https://github.com/patzick)! - Package release

### Minor Changes

- [#2406](https://github.com/shopware/frontends/pull/2406) [`df93461`](https://github.com/shopware/frontends/commit/df93461434cb79ec9d722cdbd42a37a9af07fb03) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Publish the Nuxt layer that provides shared UnoCSS presets, Shopware design tokens, and the UnoCSS runtime plugin for dynamic CMS utility classes.
