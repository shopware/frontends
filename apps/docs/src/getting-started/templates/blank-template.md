# Blank Template

<img src="../../.assets/blank-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

The blank template contains no UI or markup - it's just a blank Nuxt3 application with pre-installed dependencies, so you can start working on your project right away.

## Setup & run

<PageRef target="blank" title="Run on Stackblitz" page="https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-blank" sub="Open the Blank Template with our browser IDE in a new window" icon="https://blog.stackblitz.com/img/favicon.png?hash=3817f5a9d1"/>

Alternatively, set up the blank template manually by running the following commands in a new directory:

TODO: Add correct command

```bash
git clone https://github.com/shopware/frontends/templates/vue-blank.git .
npm i && npm run dev
```

## Configure

The blank template is pre-configured to connect to a public Shopware backend, so you can follow our [building guides](./../navigation.md) right away.

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

## What next?

<PageRef page="../navigation" title="Build your first component" sub="Now that your blank template is set up, let's build a store" />
