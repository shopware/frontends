# Demo Store Template

<img src="../../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

The demo store template is a reference implementation of an online store UI.

## Setup & run

<PageRef target="blank" title="Run on Stackblitz" page="https://stackblitz.com/edit/shopware-vue-template?file=app.vue&terminal=install,dev" sub="Open the Demo Store Template with our browser IDE in a new window" icon="https://blog.stackblitz.com/img/favicon.png?hash=3817f5a9d1"/>

Alternatively, set up the blank template manually by running the following commands in a new directory:

TODO: Add correct command

```bash
mkdir demo-store && cd demo-store
git clone https://github.com/shopware/frontends/templates/demo-store.git .
```

## Directory structure

The directory structure is the same as in a [default Nuxt project](https://nuxtjs.org/docs/get-started/directory-structure/):

```json
demo-store/
├─ components/
|  ├─ layout/       /* header, footer, account menu etc. */
|  ├─ checkout/     /* cart items, cart overview */
|  ├─ account/      /* order history, account settings */
|  ├─ shared/       /* modals, notifications */
|  ├─ ...
├─ layouts/
│  ├─ checkout.vue  /* minimal layout without navigation and footer */
│  ├─ default.vue   /* default layout with navigation and footer */
├─ pages/
│  ├─ checkout/     /* checkout pages */
│  ├─ account/      /* user account pages */
│  ├─ ...
├─ app.vue          /* app root component */
├─ nuxt.config.ts   /* app configuration */
├─ package.json
├─ tsconfig.json
```

The `components` directory contains components that have been extracted from their corresponding page components, so these become more readable. The components within `components` are organized based on the page and layout components they are used in. The `shared` directory contains generic components that are used across multiple pages and layouts.

## Customizing the template

There is no concept of overriding components in the demo store template. Instead, all components are modified directly. When creating a new project, we recommend adding your custom git repository as a remote and keeping the original demo store template as a fork, so you can always pull changes manually.

:::warning Updates & Breaking Changes
The demo store template is a boilerplate, so it will constantly be updated, as we will continously add new features and make improvements. These updates include breaking changes. If you want to stay up to date with the latest changes, you need to keep your project in sync manually.
:::

### CMS Components

One exception to the rule are CMS components. CMS components are handled as a separate package `cms-base` in Shopware Frontends and can be updated automatically. However, you can still override the components from the package in your custom project.

<PageRef page="./../../framework/shopping-experiences" title="Customize CMS Components" sub="Override CMS components using the cms-base package" />

## Configure

The blank template is pre-configured to connect to a public Shopware backend, so you start building right away.

In order to connect it to your own store backend, you need to edit the `nuxt.config.ts` file and add a configuration object with `shopware` as a key:

```ts{4-7}
/* ... */
export default defineNuxtConfig({
  /* ... */
  shopware: {
    endpoint: "https://your-business.shopware.store",
    accessToken: "access-token-from-settings",
  }
});
```
