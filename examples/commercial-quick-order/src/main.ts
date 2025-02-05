import { createShopwareContext } from "@shopware/composables";
import { createApp } from "vue";
import App from "./App.vue";
import { apiClient } from "./apiClient";

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);
app.use(shopwareContext);
app.mount("#app");
