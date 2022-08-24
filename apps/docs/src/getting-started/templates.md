# Setup Templates

Shopware Frontends offers two shortcuts to getting started with your custom frontend. These so-called templates offer different levels of "completeness" of a project.

:::tip HINT 💡
You can also integrate Shopware Frontends as an **npm package** into your existing [custom Javascript project](#custom-project).
:::

## Demo Store Template

<img src="../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

:::info
The **Demo Store Template** is not a fully-functional online store. It is only a reference implementation that contains most of the features which you can use as a starting point. It is not possible to update it automatically or install Shopware extensions on it.
:::

The demo store template is a reference implementation of an online store UI. It comes with all default features implemented as boilerplate code - such as

- Navigation & Header
- Cart
- Checkout
- CMS Pages

It is based on Nuxt3 and Tailwind.css.

<PageRef page="./templates/demo-store-template" title="Get started with the Demo Store Template" sub="A reference implementation of a store based on Vue.js" />

## Blank Template

<img src="../.assets/blank-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

If you like to start from scratch, you can use the blank template. It can be handy if you want to use a different CSS framework or create a completely new frontend, but leverage the built-in functionality of all Shopware Frontends packages.

The blank template has all "non-UI" packages pre-installed, but you have to bring your own styles and components.

<PageRef page="./templates/blank-template" title="Get started with the Blank Template" sub="A blank Nuxt.js project pre-installed with all packages" />

## Custom project

:::warning
Steps below will cover the process of implementing a working solution for Vite + Vue 3 + TypeScript (optional) setup.
:::

If you want to integrate Shopware Frontends into an existing projects or start from scratch, follow the steps below:

### Install dependencies

[TODO: Remove old composables dependency once createSpark method is moved to the composables-next]

```bash
pnpm add @shopware-pwa/composables @shopware-pwa/composables-next @shopware-pwa/shopware-6-client
```

Thanks to this, the project has all required dependencies to work with Shopware 6. If you are using TypeScript in you application, you may want to have another package that can be installed for dev dependencies:

```bash
pnpm add -D @shopware-pwa/types
```

Additionally, to keep the current session context even after page reloads, we are going to install a cookie helper to set and get value of [context token](https://shopware.stoplight.io/docs/store-api/ZG9jOjEwODA3NjQx-authentication-and-authorisation) in our plugin:

```bash
pnpm add js-cookie
```

Now, let's configure the API Client and business logic together.

:::info
The business logic is written to be Vue 3 compatible. Under the hood, it utilizes the composition API, especially provide/inject feature for sharing a state.
:::

In order to configure the business logic and API client together with Vue 3 application, it's required to create a Shopware instance provided by a factory method within `@shopware-pwa/composables` package. Everything will be encapsulated in a plugin, installed later on.

:::tip Plugins theory
This section requires having a knowledge about Vue3 plugins available [at official documentation](https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin).
:::

Import necessary methods from `@shopware-pwa` packages:

```ts{4-6}
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";
import { createInstance } from "@shopware-pwa/shopware-6-client";
import { createSpark } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

```

Prepare some types to be used during registration a plugin to pass basic credentials for you Shopware 6 API instance.

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

Now, once the plugin is created, we need to create an API client instance and the Shopware instance for Vue application. `install` method is a good place for that:

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

:::info
Context token may change after some operations like login or logout.
:::

Then, we can take advantage of `onConfigChange` method that executes when API client detects a new value of context token that come from API (as header or response body). In that case, the new context token should be saved in the cookie to keep a right session:

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

Another step is to create Shopware instance that combines API Client and the business logic in composables to be used in entire Vue application:

```ts
const shopwareContext = createSpark(app, {
  // `app` from install() method's argument
  apiInstance: instance, // pass API Client instance
  enableDevtools: true, // decide if devtools should be enabled
  shopwareDefaults: options?.apiDefaults || {}, // define some api default parameters - explained in Configuration section
});
```

And the last step is to provide `shopwareContext`:

```ts
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
```

### Register the plugin

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

After your setup, you can follow our building guides to get started with Shopware Frontends

<PageRef page="../getting-started/navigation" title="Getting Started - Navigation" sub="Let's implement a store navigation" />
