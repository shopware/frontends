import { createShopwareContext } from "@shopware/composables";
import { createApp } from "vue";

const app = createApp({});
const options = {
  enableDevtools: false,
};

const shopwareContext = createShopwareContext(app, {
  enableDevtools: !!options.enableDevtools, // decide if devtools should be enabled
});

export { shopwareContext };
