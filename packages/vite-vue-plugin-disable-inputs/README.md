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
