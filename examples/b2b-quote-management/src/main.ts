import { createApp } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import { apiClient } from "./apiClient";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Quote from "./components/Quote.vue";
import QuotesTable from "./components/QuotesTable.vue";

const routes = [
  { path: "/", component: App, name: "home" },
  { path: "/quotes", component: QuotesTable, name: "quotesTable" },
  { path: "/quote/:id", component: Quote, name: "quote" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);
app.use(shopwareContext);
app.use(router);
app.mount("#app");
