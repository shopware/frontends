import { createAPIClient } from "@shopware/api-client";
import { createShopwareContext } from "@shopware/composables";
import Cookies from "js-cookie";
// ./plugins/vue-shopware-frontends.ts file
import type { App } from "vue";
import { ref } from "vue";

interface ShopwareFrontendsOptions {
  accessToken: string;
  endpoint: string;
}

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    // Configure the API client and Shopware context here.
  },
};
