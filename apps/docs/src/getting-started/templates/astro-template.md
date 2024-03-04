<script setup>
import stackblitzIcon from '../../.assets/framework-icons/stackblitz.png';
</script>

# Astro Blank Template

<img src="../../.assets/astro-template.png" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

The blank Astro bootstrap application with pre-installed dependencies, so you can start working on your project right away.

**Now you can use `composables` and `api-client` libraries in every Vue component created in an Astro project.**

## Setup & run

<PageRef target="blank" title="Run on Stackblitz" page="https://stackblitz.com/github/shopware/frontends/tree/main/templates/astro" sub="Open the Blank Template with our browser IDE in a new window" :icon="stackblitzIcon" />

Alternatively, set up the astro-blank template manually by running the following commands in a new directory:

```bash
npx tiged shopware/frontends/templates/astro astro-blank && cd astro-blank
npm i && npm run dev
```

## Configure

The blank template is pre-configured to connect to a public Shopware backend, so you can follow our [building guides](../../getting-started/) right away.

In order to connect it to your own store backend, you need to edit the `env.development`:

```bash
# .env.development
API_URL="https://demo-frontends.shopware.store"
API_ACCESS_TOKEN="SWSCBHFSNTVMAWNZDNFKSHLAYW"
```

:::info Production
For production build it's good to prepare a separate `.env.production` file containing other credentials if needed.
:::

If the customization isn't enough, visit `src/entrypoints/_shopware.ts` file and customize it on your own. Like, change cookie manager, or add some other configuration for API client instance.

## What next?

<PageRef page="../navigation" title="Build your first component" sub="Now that your blank template is set up, let's build a store" />
