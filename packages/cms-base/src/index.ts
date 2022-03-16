/**
 * @module @shopware/cms-base
 */
import { defineNuxtModule } from "@nuxt/kit";
import { NuxtModule } from "@nuxt/schema";
import { resolve } from "path";

export interface CmsBaseOptions {}

const nuxtModule: NuxtModule<CmsBaseOptions> = defineNuxtModule({
  meta: {
    name: "@shopware/cms-base",
    configKey: "shopware-cms",
  },
  setup(_, nuxt) {
    nuxt.hook("components:dirs", (c: any) => {
      c.push({
        path: resolve(__dirname, "../components"),
        global: true,
      });
    });
  },
});

export default nuxtModule;
