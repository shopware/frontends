# vite-vue-plugin-disable-inputs

Test your Vue applications with Playwright without worrying that Playwright is too quick for your application.

Thanks to this plugin all inputs and buttons are initially disabled until application is mounted. So nothing can be invoked by playwright too early causing tests to fail.

## ⚠️ DEPRECATED

Using [expect.toPass](https://playwright.dev/docs/test-assertions#expecttopass) seems to be a better, and less invasive solution in order to achieve the same goal. Even though an app is not mounted, `toPass` assertion will retry the same test block, reflecting more human behavior, when for instance, some button is not active, an user will try to click it twice.

## Installation

Add the package as `devDependency` using your favorite package manager:

```sh
pnpm add -D vite-vue-plugin-disable-inputs
```

Then, extend your's `vitepress` configuration by adding the vite plugins:

```ts
import { VueDisableInputsBeforeMount } from "vite-vue-plugin-disable-inputs";

export default defineNuxtConfig({
  vite: {
    plugins: [VueDisableInputsBeforeMount()],
  },
});
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/vite-vue-plugin-disable-inputs/CHANGELOG.md)

### Latest changes: 0.2.0

### Minor Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - DEPRECATION - this package is deprecated and no longer maintained.

  Using [expect.toPass](https://playwright.dev/docs/test-assertions#expecttopass) seems to be a better, and less invasive solution in order to achieve the same goal. Even though an app is not mounted, `toPass` assertion will retry the same test block, reflecting more human behavior, when for instance, some button is not active, an user will try to click it twice.

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.4.4** to **^4.4.7**
