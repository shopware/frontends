# Vue Starter Template

A Nuxt storefront foundation with all Shopware Frontends packages pre-configured.

**[Live Demo →](https://frontends-starter-template.vercel.app/)**

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Docker

Build and run the production image from this directory:

```bash
docker build -t shopware-vue-starter .
docker run --rm -p 3000:3000 \
  -e NUXT_PUBLIC_SHOPWARE_ENDPOINT="https://your-shop.example/store-api/" \
  -e NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN="your-sales-channel-token" \
  -e NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL="" \
  shopware-vue-starter
```

You can also pass environment variables from a local `.env` file:

```bash
docker run --rm -p 3000:3000 --env-file .env shopware-vue-starter
```

The Docker image reads the same Nuxt public runtime variables as local development:

```bash
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://your-shop.example/store-api/
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN=your-sales-channel-token
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=
NUXT_SHOPWARE_ENDPOINT=
```

`NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL` is mainly useful for local development when the Shopware sales channel domain does not match `localhost`. In production, leave it empty unless you specifically need to override it.

`NUXT_SHOPWARE_ENDPOINT` is optional. Use it only when server-side requests from the container should target a different internal URL than the browser-facing `NUXT_PUBLIC_SHOPWARE_ENDPOINT`.

The template includes a `.dockerignore` file so local `node_modules`, `.nuxt`, `.output`, and `.env` files are not copied into the image. This is important:

- your local `.env` must not be baked into the image during `docker build`
- the Shopware instance must be selected at container runtime via `docker run --env-file .env` or `-e ...`

## Styling and Shopping Experiences integration

This tempalte uses [UnoCSS](https://unocss.dev/) for styling, which is a utility-first CSS framework. It is configured to use the [Tailwind CSS](https://tailwindcss.com/) classes.

The template also includes a [CMS Base nuxt layer](https://www.npmjs.com/package/@shopware/cms-base-layer) to provide the CMS components for Shopping Experiences integration. The layer is registered in the `nuxt.config.ts` file. In order to override the default Tailwind CSS configuration, you can create your own `uno.config.ts` file in the root of your project and extend the default configuration.

## Need a More Complete Example?

If you're looking for a more comprehensive example with pre-built pages, custom styling, and real-world e-commerce patterns, check out the [vue-starter-template-extended](../vue-starter-template-extended).

The extended template:
- Extends this base template as a Nuxt layer
- Includes a complete store theme (Lumora - Modern Home Scents)
- Demonstrates component overrides and customization patterns
- Shows how to work with Shopware CMS default setup
- Provides examples of custom pages, layouts, and styling

**Use the base template** (this one) when you want to start from scratch with minimal setup and maximum flexibility.

**Use the extended template** when you want to see a complete implementation or need a head start with pre-built components and styling.

## Fastly and ISR

This template uses Nuxt route rules with ISR for public storefront pages and adds `Surrogate-Control` headers for CDN caching:

- public storefront routes: `Surrogate-Control: max-age=3600, stale-while-revalidate=86400`
- checkout, account, and wishlist routes: `Surrogate-Control: no-store`

For a Fastly-backed Node deployment, the usual setup is:

- cache `GET` and `HEAD` HTML responses when `Surrogate-Control` or cacheable `Cache-Control` is present
- bypass caching for `/checkout`, `/account`, and `/wishlist`
- avoid caching responses that set cookies or depend on user/session-specific SSR

Nuxt/Nitro provides the cache headers. Fastly still needs to be configured to respect them for HTML responses.
