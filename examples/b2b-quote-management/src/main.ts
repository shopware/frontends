import { createApp } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import { apiClient } from "./apiClient";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Quote from "./components/Quote.vue";
import QuotesTable from "./components/QuotesTable.vue";
import RequestQuote from "./components/RequestQuote.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "virtual:uno.css";
import "./assets/main.css";

const routes = [
  { path: "/", component: App, name: "home" },
  { path: "/quotes", component: QuotesTable, name: "quotesTable" },
  { path: "/quote/:id", component: Quote, name: "quote" },
  { path: "/request-quote", component: RequestQuote, name: "requestQuote" },
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
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.mount("#app");
