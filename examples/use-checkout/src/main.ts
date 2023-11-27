import { createApp } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";

// @ts-ignore import of the vue file
import App from "./App.vue";
import { apiClient } from "./apiClient";

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.use(shopwareContext);

app.provide("apiClient", apiClient);

app.mount("#app");
