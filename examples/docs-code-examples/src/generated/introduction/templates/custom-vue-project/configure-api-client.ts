// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";
import { createAPIClient } from "@shopware/api-client";
import { createShopwareContext } from "@shopware/composables";
import Cookies from "js-cookie";

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    ...
  },
};

