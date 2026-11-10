import { createShopwareContext } from "@shopware/composables";
import { createApp } from "vue";

const app = createApp({});

const shopwareContext = createShopwareContext(app, {});

export { shopwareContext };
