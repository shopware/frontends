import { createApp } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import { createRouter, createWebHistory } from "vue-router";
import { apiClient } from "./apiClient";

import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)",
      component: () => import("./App.vue"),
    },
  ],
});
const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);
app.use(router);
app.use(shopwareContext);
app.mount("#app");
