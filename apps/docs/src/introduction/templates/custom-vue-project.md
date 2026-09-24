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

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/creating-vue-project.sh" code lang="bash" no-name -->

```bash
pnpm create vue@latest
```

<!-- /automd -->

More information about creating a new Vue project can be found [here](https://vuejs.org/guide/quick-start.html)

## Install dependencies

First of all, install the required npm dependencies:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/install-dependencies.sh" code lang="bash" no-name -->

```bash
pnpm add @shopware/composables @shopware/api-client
```

<!-- /automd -->

Additionally, to keep the current session context even after page reloads, we are going to install a cookie helper to set and get value of [context token](https://shopware.stoplight.io/docs/store-api/ZG9jOjEwODA3NjQx-authentication-and-authorisation) in our plugin:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/install-dependencies-2.sh" code lang="bash" no-name -->

```bash
pnpm add js-cookie
```

<!-- /automd -->

For CMS components, you can add a package that contains ready-to-use components.
You can read more about CMS pages here:

<PageRef page="../cms/content-pages.html" title="Create content pages" sub="Render a content page using components" />

<!-- automd:pm-install name="@shopware/cms-base-layer" dev -->

```sh
# ✨ Auto-detect
npx nypm install -D @shopware/cms-base-layer

# npm
npm install -D @shopware/cms-base-layer

# yarn
yarn add -D @shopware/cms-base-layer

# pnpm
pnpm add -D @shopware/cms-base-layer

# bun
bun install -D @shopware/cms-base-layer

# deno
deno install --dev npm:@shopware/cms-base-layer
```

<!-- /automd -->

## Configure API client

:::tip Code example
Find a full example of the Vue.js plugin [here](#plugin-code).
:::

Now, let's configure the API client and business logic together.

:::info
The business logic is written to be Vue 3 compatible. Under the hood, it utilizes the composition API, especially the `provide`/`inject` feature for sharing state.
:::

In order to configure the business logic and API client together with your Vue 3 application, it's required to create a Shopware instance provided by a factory method within the `@shopware/composables` package. Everything will be encapsulated in a plugin and installed later on.

:::tip Vue plugins
This section requires having knowledge about the [concept of Vue 3 plugins](https://vuejs.org/guide/reusability/plugins.html#writing-a-plugin).
:::

Import necessary methods from `@shopware/api-client`, `@shopware/composables` and `js-cookie` packages:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/configure-api-client.ts" code lang="ts" no-name -->

```ts
import { createAPIClient } from "@shopware/api-client";
import { createShopwareContext } from "@shopware/composables";
import Cookies from "js-cookie";
// ./plugins/vue-shopware-frontends.ts file
import type { App } from "vue";
import { ref } from "vue";

interface ShopwareFrontendsOptions {
  accessToken: string;
  endpoint: string;
}

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    // Configure the API client and Shopware context here.
  },
};
```

<!-- /automd -->

We prepare some types to be used during the registration of the plugin to pass basic credentials for your Shopware 6 instance.

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/configure-api-client-2.ts" code lang="ts" no-name -->

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

<!-- /automd -->

Now, once the plugin is created, we need to create an API client instance and the Shopware instance for Vue application.

The install method is a good place to do that:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/configure-api-client-3.txt" code lang="ts" no-name -->

```ts
import { ref } from "#imports";

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

<!-- /automd -->

## Handle client state

:::tip Code example
Complete code example can be found [HERE](./custom-vue-project.html#plugin-code) you can find a full example of the plugin
:::

Now, we need to ensure that the context token, which identifies a user session, is properly stored and updated. The context token may change after operations like login or logout.

Then, we can take advantage of the onConfigChange method. It executes when the API client detects a new value of the context token coming from the API (as a header parameter or in the response body). In that case, the new context token should be saved in the cookie to keep the correct session:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/handle-client-state.txt" code lang="ts" no-name -->

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

<!-- /automd -->

Another step is to create a Shopware instance that combines API Client and the business logic in composables to be used in entire Vue application:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/handle-client-state-2.txt" code lang="ts" no-name -->

```ts
import { createShopwareContext } from "#imports";

const shopwareContext = createShopwareContext(app, {
  enableDevtools: !!options.enableDevtools, // decide if devtools should be enabled
});
```

<!-- /automd -->

And the last step is to provide the shopwareContext:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/handle-client-state-3.txt" code lang="ts" no-name -->

```ts
import { provide, ref } from "#imports";

app.provide("apiClient", apiClient);
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
app.provide("swSessionContext", ref());
```

<!-- /automd -->

## Register the plugin

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/register-the-plugin.txt" code lang="ts{6,9-14}" no-name -->

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

<!-- /automd -->

## Plugin code

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/plugin-code.txt" code lang="ts" no-name -->

```ts
import { createAPIClient } from "@shopware/api-client";
import { createShopwareContext } from "@shopware/composables";
import Cookies from "js-cookie";
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";

import { provide } from "#imports";

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

    const apiClient = createAPIClient<operations>({
      baseURL: options.endpoint,
      accessToken: options.accessToken,
      contextToken: contextToken.value,
    });

    const shopwareContext = createShopwareContext(app, {
      enableDevtools: !!options.enableDevtools,
    });

    app.provide("apiClient", apiClient);
    app.provide("shopware", shopwareContext);
    app.provide("swSessionContext", ref());
  },
};
```

<!-- /automd -->

## Shopware Endpoint on the SSR mode

It may happen that for SSR and CSR, you need two different shopware endpoints. One of the most common situations is when you are using an internal network for communication between apps.

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/shopware-endpoint-on-the-ssr-mode" code no-name -->

```
Server URL to the backend: http://shopware (not exposed)
Client URL to the backend  https://demo-frontends.shopware.store (exposed)
```

<!-- /automd -->

If you are using the Nuxt plugin, you can set private and public envs:

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/shopware-endpoint-on-the-ssr-mode-2" code no-name -->

```
NUXT_SHOPWARE_ENDPOINT=http://shopware
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://demo-frontends.shopware.store
```

<!-- /automd -->

Otherwise, make sure that you are setting different values on the create instance phase

<!-- automd:file src="examples/docs-code-examples/src/generated/introduction/templates/custom-vue-project/shopware-endpoint-on-the-ssr-mode.txt" code lang="ts" no-name -->

```ts
const instance = createInstance({
  endpoint: ssrValue || clientValue,
  accessToken: options.accessToken,
  timeout: options.shopwareApiClient?.timeout || 5000,
  contextToken: contextToken.value,
  languageId: languageId.value,
});
```

<!-- /automd -->

:::warning
If you need to redirect your media, you can use the `shopware.yaml` file to configure the main media URL.
For more details, please visit this [site](https://developer.shopware.com/docs/guides/hosting/infrastructure/filesystem.html#flysystem-overview).
:::

## Next steps

After your setup, you can follow our building guides to get started with Shopware Frontends

<PageRef page="../page-elements/navigation.html" title="Getting Started - Navigation" sub="Let's implement a store navigation" />
