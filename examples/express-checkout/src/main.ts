import { createApp, ref } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";
import { apiClient } from "./apiClient";

import App from "./App.vue";

const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken);
const languageId = ref(cookieLanguageId);
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
