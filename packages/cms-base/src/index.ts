/**
 * @module @shopware/cms-base
 */
import { defineNuxtModule } from "@nuxt/kit";
import { NuxtModule } from "@nuxt/schema";
import { resolve } from "path";

const nuxtModule: NuxtModule = defineNuxtModule({
  meta: {
    name: "@shopware/cms-base",
    configKey: "shopware-cms",
  },
  setup(_, nuxt) {
    nuxt.hook("components:dirs", (c) => {
      c.push({
        path: resolve(__dirname, "../components"),
        global: true,
      });
    });

    // FIX until https://github.com/unjs/nitro/issues/294 is resolved
    nuxt.options.autoImports.transform =
      nuxt.options.autoImports.transform || {};
    nuxt.options.autoImports.transform.include =
      nuxt.options.autoImports.transform?.include || [];
    nuxt.options.autoImports.transform?.include.push(/.+cms-base.+/);
  },
});

export default nuxtModule;
