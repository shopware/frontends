import { createShopwareContext } from "@shopware/composables/dist";

import "./style.css";
import { createApp } from "vue";

import { apiClient } from "./apiClient";
import App from "./App.vue";

const app = createApp(App);

// setup shopware plugin
const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);

// register a plugin in a Vue instance
app.use(shopwareContext);

app.mount("#app");
