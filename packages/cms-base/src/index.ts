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
  },
});

export default nuxtModule;
