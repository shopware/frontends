import { resolve } from "node:path";
/**
 * @module @shopware/cms-base
 */
import { defineNuxtModule } from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";

const nuxtModule: NuxtModule = defineNuxtModule({
  meta: {
    name: "@shopware/cms-base",
    configKey: "shopware-cms",
  },
  setup(_, nuxt) {
    nuxt.hook("components:dirs", (c) => {
      c.push({
        path: resolve(__dirname, "../components/public"),
        global: true,
      });
    });

    // FIX until https://github.com/unjs/nitro/issues/294 is resolved
    nuxt.options.imports.transform = nuxt.options.imports.transform || {};
    nuxt.options.imports.transform.include =
      nuxt.options.imports.transform?.include || [];
    nuxt.options.imports.transform?.include.push(/.+cms-base.+/);
  },
});

export default nuxtModule;
