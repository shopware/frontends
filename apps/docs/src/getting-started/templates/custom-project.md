# Custom project

Follow these steps to integrate Shopware Frontends into an existing, custom Vue.js project

- Install the required dependencies
- Prepare a Vue plugin for better encapsulation
- Configure the API client and create application instance
- Store and handle client state

## Install dependencies

[TODO: Remove old composables dependency once `createShopwareContext` method is moved to the composables-next]

First of all, install the required npm dependencies:

```bash
pnpm add @shopware-pwa/composables @shopware-pwa/composables-next @shopware-pwa/shopware-6-client
```

If you are using TypeScript in you application, you may want to have another package that can be installed for dev dependencies:

```bash
pnpm add -D @shopware-pwa/types
```

Additionally, to keep the current session context even after page reloads, we are going to install a cookie helper to set and get value of [context token](https://shopware.stoplight.io/docs/store-api/ZG9jOjEwODA3NjQx-authentication-and-authorisation) in our plugin:

```bash
pnpm add js-cookie
```

## Configure API client

Now, let's configure the API client and business logic together.

:::info
The business logic is written to be Vue 3 compatible. Under the hood, it utilizes the composition API, especially the `provide`/`inject` feature for sharing state.
:::

In order to configure the business logic and API client together with your Vue 3 application, it's required to create a Shopware instance provided by a factory method within the `@shopware-pwa/composables` package. Everything will be encapsulated in a plugin and installed later on.

:::tip Vue plugins
This section requires having knowledge about the [concept of Vue 3 plugins](https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin).
:::

Import necessary methods from `@shopware-pwa` packages:

```ts{4-6}
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";
import { createInstance } from "@shopware-pwa/api-client";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

```

We prepare some types to be used during the registration of the plugin to pass basic credentials for your Shopware 6 instance.

```ts{1-8,11}
type ShopwareFrontendsOptions = {
  shopwareEndpoint: string;
  shopwareAccessToken: string;
  apiDefaults: any;
  shopwareApiClient: {
    timeout: number;
  };
};

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
```

Now, once the plugin is created, we need to create an API client instance and the Shopware instance for Vue application. The `install` method is a good place to do that:

```ts{7}
// try to fetch the context token if it's previously set in a cookie
const cookieContextToken = Cookies.get("sw-context-token");
// set the current context token if exists to the ref
const contextToken = ref(cookieContextToken);

// create API client instance using `createInstance()` method imported from `@shopware-pwa/shopware-6-client` package
const instance = createInstance({
    endpoint: options.shopwareEndpoint,
    accessToken: options.shopwareAccessToken,
    timeout: options.shopwareApiClient?.timeout || 5000,
    contextToken: contextToken.value,
});
```

## Handle client state

Now, we need to ensure that the context token, which identifies a user session, is properly stored and updated. The context token may change after operations like login or logout.

Then, we can take advantage of the `onConfigChange` method. It executes when the API client detects a new value of the context token coming from the API (as a header parameter or in the response body). In that case, the new context token should be saved in the cookie to keep the correct session:

```ts
/**
 * Save current contextToken when it changes
 */
instance.onConfigChange(({ config }) => {
  try {
    // set the new cookie based on incoming `config`
    Cookies.set("sw-context-token", config.contextToken || "", {
      expires: 365,
      sameSite: "Lax",
      path: "/",
    });
    // change reactive value of shared context token
    contextToken.value = config.contextToken;
  } catch (e) {
    // Sometimes cookie is set on server after request is send, it can fail silently
  }
});
```

Another step is to create a Shopware instance that combines API Client and the business logic in composables to be used in entire Vue application:

```ts
const shopwareContext = createShopwareContext(app, {
  // `app` from install() method's argument
  apiInstance: instance, // pass API Client instance
  enableDevtools: true, // decide if devtools should be enabled
  shopwareDefaults: options?.apiDefaults || {}, // define some api default parameters - explained in Configuration section (TODO: Explain in Configuration Section)
});
```

And the last step is to provide the `shopwareContext`:

```ts
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
```

## Register the plugin

```ts{6,9-14}
// main.ts
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import previously implemented module
import ShopwareFrontends from "./plugins/vue-shopware-frontends";
const app = createApp(App);

app.use(ShopwareFrontends, {
    // pass options described under ShopwareFrontendsOptions type in the previous section
    shopwareEndpoint: "https://demo-frontends.swstage.store",
    shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    apiDefaults: {},
});

app.mount("#app");
```

## Next steps

After your setup, you can follow our building guides to get started with Shopware Frontends

<PageRef page="../../getting-started/navigation" title="Getting Started - Navigation" sub="Let's implement a store navigation" />
