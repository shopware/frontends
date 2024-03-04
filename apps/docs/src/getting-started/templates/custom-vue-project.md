# Custom Vue.js project

Follow these steps to integrate Shopware Frontends into an existing, custom Vue.js project

- Install the required dependencies
- Prepare a Vue plugin for better encapsulation
- Configure the API client and create application instance
- Store and handle client state

## Creating Vue project

:::info
You can skip this part if you have an existing project.
::::

```bash
pnpm create vue@latest
```

More information about creating a new Vue project can be found [here](https://vuejs.org/guide/quick-start.html)

## Install dependencies

First of all, install the required npm dependencies:

```bash
pnpm add @shopware-pwa/composables-next @shopware-pwa/api-client
```

If you are using TypeScript in you application, you may want to have another package that can be installed for dev dependencies:

```bash
pnpm add -D @shopware-pwa/types
```

Additionally, to keep the current session context even after page reloads, we are going to install a cookie helper to set and get value of [context token](https://shopware.stoplight.io/docs/store-api/ZG9jOjEwODA3NjQx-authentication-and-authorisation) in our plugin:

```bash
pnpm add js-cookie
```

For CMS components, you can add a package that contains ready-to-use components.
You can read more about CMS pages here:

<PageRef page="../cms/content-pages" title="Create content pages" sub="Render a content page using components" />

```bash
pnpm add @shopware-pwa/cms-base
```

## Configure API client

:::tip Code example
Find a full example of the Vue.js plugin [here](#plugin-code).
:::

Now, let's configure the API client and business logic together.

:::info
The business logic is written to be Vue 3 compatible. Under the hood, it utilizes the composition API, especially the `provide`/`inject` feature for sharing state.
:::

In order to configure the business logic and API client together with your Vue 3 application, it's required to create a Shopware instance provided by a factory method within the `@shopware-pwa/composables-next` package. Everything will be encapsulated in a plugin and installed later on.

:::tip Vue plugins
This section requires having knowledge about the [concept of Vue 3 plugins](https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin).
:::

Import necessary methods from `@shopware-pwa/api-client`, `@shopware-pwa/composables-next` and `js-cookie` packages:

```ts
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";
import { createInstance } from "@shopware-pwa/api-client";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    ...
  },
};

```

We prepare some types to be used during the registration of the plugin to pass basic credentials for your Shopware 6 instance.

```ts
export type ShopwareFrontendsOptions = {
  endpoint: string;
  accessToken: string;
  shopwareApiClient?: {
    timeout: number;
  };
  enableDevtools?: boolean;
};
```

Now, once the plugin is created, we need to create an API client instance and the Shopware instance for Vue application.

The install method is a good place to do that:

```ts
const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken);
const languageId = ref(cookieLanguageId);

const instance = createInstance({
  endpoint: options.endpoint,
  accessToken: options.accessToken,
  timeout: options.shopwareApiClient?.timeout || 5000,
  contextToken: contextToken.value,
  languageId: languageId.value,
});
```

## Handle client state

:::tip Code example
Complete code example can be found [HERE](./custom-vue-project.html#plugin-code) you can find a full example of the plugin
:::

Now, we need to ensure that the context token, which identifies a user session, is properly stored and updated. The context token may change after operations like login or logout.

Then, we can take advantage of the onConfigChange method. It executes when the API client detects a new value of the context token coming from the API (as a header parameter or in the response body). In that case, the new context token should be saved in the cookie to keep the correct session:

```ts
/**
 * Save current contextToken when it changes
 */
instance.onConfigChange(({ config }) => {
  try {
    Cookies.set("sw-context-token", config.contextToken || "", {
      expires: 365,
      sameSite: "Lax",
      path: "/",
    });
    Cookies.set("sw-language-id", config.languageId || "", {
      expires: 365,
      sameSite: "Lax",
      path: "/",
    });

    contextToken.value = config.contextToken;
    languageId.value = config.languageId;
  } catch (e) {
    // Sometimes cookie is set on server after request is send, it can fail silently
  }
});
```

Another step is to create a Shopware instance that combines API Client and the business logic in composables to be used in entire Vue application:

```ts
const shopwareContext = createShopwareContext(app, {
  apiInstance: instance, // pass API Client instance
  enableDevtools: !!options.enableDevtools, // decide if devtools should be enabled
});
```

And the last step is to provide the shopwareContext:

```ts
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
app.provide("swSessionContext", ref());
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
    endpoint: "https://demo-frontends.swstage.store",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    apiDefaults: {},
});

app.mount("#app");
```

## Plugin code

```ts
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";
import { createInstance } from "@shopware-pwa/api-client";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

// Types to be used during the registration of the plugin to pass basic credentials for your Shopware 6 instance.
export type ShopwareFrontendsOptions = {
  endpoint: string;
  accessToken: string;
  shopwareApiClient?: {
    timeout: number;
  };
  enableDevtools?: boolean;
};

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    const cookieContextToken = Cookies.get("sw-context-token");
    const cookieLanguageId = Cookies.get("sw-language-id");

    const contextToken = ref(cookieContextToken);
    const languageId = ref(cookieLanguageId);

    const instance = createInstance({
      endpoint: options.endpoint,
      accessToken: options.accessToken,
      timeout: options.shopwareApiClient?.timeout || 5000,
      contextToken: contextToken.value,
      languageId: languageId.value,
    });

    instance.onConfigChange(({ config }) => {
      try {
        Cookies.set("sw-context-token", config.contextToken || "", {
          expires: 365,
          sameSite: "Lax",
          path: "/",
        });
        Cookies.set("sw-language-id", config.languageId || "", {
          expires: 365,
          sameSite: "Lax",
          path: "/",
        });

        contextToken.value = config.contextToken;
        languageId.value = config.languageId;
      } catch (e) {
        // Sometimes cookie is set on server after request is send, it can fail silently
      }
    });

    const shopwareContext = createShopwareContext(app, {
      apiInstance: instance,
      enableDevtools: !!options.enableDevtools,
    });

    app.provide("shopware", shopwareContext);
    app.provide("swSessionContext", ref());
  },
};
```

## Shopware Endpoint on the SSR mode

It may happen that for SSR and CSR, you need two different shopware endpoints. One of the most common situations is when you are using an internal network for communication between apps.

```
Server URL to the backend: http://shopware (not exposed)
Client URL to the backend  https://demo-frontends.shopware.store (exposed)
```

If you are using the Nuxt plugin, you can set private and public envs:

```
NUXT_SHOPWARE_ENDPOINT=http://shopware
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://demo-frontends.shopware.store
```

Otherwise, make sure that you are setting different values on the create instance phase

```ts
const instance = createInstance({
  endpoint: ssrValue || clientValue,
  accessToken: options.accessToken,
  timeout: options.shopwareApiClient?.timeout || 5000,
  contextToken: contextToken.value,
  languageId: languageId.value,
});
```

## Next steps

After your setup, you can follow our building guides to get started with Shopware Frontends

<PageRef page="../../getting-started/page-elements/navigation" title="Getting Started - Navigation" sub="Let's implement a store navigation" />
