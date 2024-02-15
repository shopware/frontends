import { createApp, ref } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import { getClient as getDemoClient } from "./apiClient";

import App from "./App.vue";

const app = createApp(App);
const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", getDemoClient());
app.use(shopwareContext);
app.mount("#app");
