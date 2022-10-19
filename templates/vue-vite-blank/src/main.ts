import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ShopwareContext, {
  ShopwareFrontendsOptions,
} from "@shopware-pwa/vue3-plugin";

const app = createApp(App);

// setup shopware plugin
const options: ShopwareFrontendsOptions = {
  shopwareEndpoint: import.meta.env.VITE_DEMO_API_URL,
  shopwareAccessToken: import.meta.env.VITE_DEMO_API_ACCESS_TOKEN,
};
// register the plugin
app.use(ShopwareContext, options);

app.mount("#app");
