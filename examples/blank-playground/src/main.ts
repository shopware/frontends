import { createApp } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import { apiClient } from "./apiClient";
import App from "./App.vue";

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);
app.use(shopwareContext);
app.mount("#app");
