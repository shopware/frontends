import { createShopwareContext } from "@shopware/composables";
import { createApp } from "vue";

const app = createApp({});
const shopware = createShopwareContext(app, {
  cacheableReads: true,
});
app.use(shopware);
