# vite-vue-plugin-disable-inputs

Test your Vue applications with Playwright without worrying that Playwright is too quick for your application.

Thanks to this plugin all inputs and buttons are initially disabled until application is mounted. So nothing can be invoked by playwright too early causing tests to fail.

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

### Latest changes: 0.1.1

### Patch Changes

- [#224](https://github.com/shopware/frontends/pull/224) [`62a985f`](https://github.com/shopware/frontends/commit/62a985f6b6ab81a38454c75e747bf425383e25e7) Thanks [@mkucmus](https://github.com/mkucmus)! - Prepared first release

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.3.9** to **^4.4.2**

- [#328](https://github.com/shopware/frontends/pull/328) [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.4.2** to **^4.4.4**
