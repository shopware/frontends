---
head:
  - - meta
    - name: og:title
      content: Installation
  - - meta
    - name: og:description
      content: "Shopware Frontends is a framework for building custom, cloud-native Shopware Storefronts."
nav:
  hidden: true
---

<script setup>
import stackblitzIcon from '.assets/framework-icons/stackblitz.png';
</script>

# Vue Starter Template

<a href="https://frontends-starter-template.vercel.app/" target="_blank"><img src=".assets/demo-store-template.jpg" alt="Vue Starter Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" /></a>

The Vue Starter Template is a production-ready foundation for building custom Shopware storefronts with Nuxt 4.x.

:::info
This template provides essential packages and configuration to start building your storefront.
:::

## Setup & run

<PageRef target="blank" title="Run on Stackblitz" page="https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-starter-template" sub="Open the Vue Starter Template with our browser IDE in a new window" :icon="stackblitzIcon" />

Alternatively, set up the vue-starter-template manually by running the following commands in a new directory:

```bash
npx tiged shopware/frontends/templates/vue-starter-template my-store && cd my-store
npm i && npm run dev
```

## Directory structure

The directory structure follows [Nuxt 4.x conventions](https://nuxt.com/docs/guide/directory-structure) with the `app/` directory:

```json
my-store/
├─ app/
│  ├─ components/
│  │  ├─ layout/       /* header, footer, account menu etc. */
│  │  ├─ checkout/     /* cart items, cart overview */
│  │  ├─ account/      /* order history, account settings */
│  │  ├─ product/      /* product components */
│  │  ├─ form/         /* form components */
│  │  ├─ shared/       /* modals, notifications */
│  │  ├─ ...
│  ├─ composables/     /* auto-imported composables */
│  ├─ layouts/
│  │  ├─ checkout.vue  /* minimal layout without navigation and footer */
│  │  ├─ default.vue   /* default layout with navigation and footer */
│  ├─ pages/
│  │  ├─ checkout/     /* checkout pages */
│  │  ├─ account/      /* user account pages */
│  │  ├─ [...all].vue  /* catch-all route for CMS pages */
│  │  ├─ ...
│  ├─ utils/           /* utility functions */
│  ├─ app.config.ts    /* app configuration */
│  ├─ app.vue          /* app root component */
├─ i18n/               /* internationalization */
├─ public/             /* static assets */
├─ server/             /* server-side code */
├─ nuxt.config.ts      /* Nuxt configuration */
├─ package.json
├─ tsconfig.json
```

The `app/components/` directory contains components organized by their usage context. The `app/composables/` directory contains auto-imported composables for shared logic.

## Customizing the template

The Vue Starter Template is designed to be customized. All components can be modified directly in your project. You can extend the template using Nuxt layers for better maintainability and to receive updates automatically.

:::tip
See the [Vue Starter Template Extended](./getting-started/templates/vue-starter-template-extended.html) example to learn how to use Nuxt layers to extend the base template while keeping your customizations separate.
:::

### CMS Components

One exception to the rule are CMS components. CMS components are handled as a separate package `cms-base` in Shopware Frontends and can be updated automatically. However, you can still override the components from the package in your custom project.

<PageRef page="./framework/shopping-experiences.html" title="Customize CMS Components" sub="Override CMS components using the cms-base package" />

## Configure

The Vue Starter Template is pre-configured to connect to a public Shopware backend, so you can start building right away.

In order to connect it to your own store backend, you need to edit the `nuxt.config.ts` file and edit a configuration object with `shopware` as a key:

```ts
/* ... */
export default defineNuxtConfig({
  runtimeConfig: {
    // shopware: {
    /**
     * SSR Shopware Endpoint
     * More here: https://frontends.shopware.com/getting-started/templates/custom-vue-project.html#shopware-endpoint-on-the-ssr-mode
     */
    //   endpoint: ""
    // },
    public: {
      shopware: {
        endpoint: "https://your-business.shopware.store",
        accessToken: "access-token-from-settings",
      },
    },
  },
});
```

You can also use `.env` file to override this configuration. More about this you can find [here](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables)

## Next Steps

Now that you have the Vue Starter Template set up, you can:

- Explore the [CMS components](./framework/shopping-experiences.html) to customize your content
- Learn about [routing](./getting-started/routing.html) to handle dynamic pages
- Build [page elements](./getting-started/page-elements/) like navigation and product listings
- Set up [e-commerce features](./getting-started/e-commerce/) like cart and checkout

If you need help or want to contribute, feel free to create an [issue](https://github.com/shopware/frontends/issues/new) or make a [contribution](https://github.com/shopware/frontends/pulls).
