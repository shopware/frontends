# Vue Starter Template

A Nuxt storefront foundation with all Shopware Frontends packages pre-configured.

**[Live Demo →](https://frontends-starter-template.vercel.app/)**

## What's inside

- Nuxt 4 application
- All Shopware Frontends packages: API client, composables, CMS base layer, Nuxt module, helpers, design tokens
- Shopping Experiences rendered by `@shopware/cms-base-layer`
- UnoCSS styling with shared design tokens
- i18n with `en-GB`, `de-DE` and `pl-PL`
- ISR route rules and CDN cache headers
- A `Dockerfile` for production builds

## Requirements

Go to [Documentation > Requirements](https://developer.shopware.com/frontends/framework/requirements.html) to see the details.

Node 20, 22 or 24. This repository uses pnpm.

## Install & Run

As a standalone project:

```bash
npx tiged shopware/frontends/templates/vue-starter-template my-store
cd my-store
pnpm i
pnpm dev
```

Inside this monorepo:

```bash
pnpm i
pnpm run build --filter='./packages/*'
pnpm run dev --filter=vue-starter-template
```

The dev server runs on `http://localhost:3000`. Use `pnpm build` for a production build, then `pnpm preview` to serve it locally.

## Set up your Shopware 6 instance

Out of the box the template talks to a public demo shop. To use your own, copy the env template and fill it in:

```bash
cp .env.template .env
```

Two values are required. The app throws on startup without them:

- `NUXT_PUBLIC_SHOPWARE_ENDPOINT` - your Store API endpoint, including the `/store-api/` suffix
- `NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN` - the sales channel access token, found in the Shopware admin under Settings > Sales Channel > API access

`.env.template` documents the optional values too. Two are worth knowing about:

`NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL` is mainly useful for local development when the Shopware sales channel domain does not match `localhost`. In production, leave it empty unless you specifically need to override it.

`NUXT_SHOPWARE_ENDPOINT` is optional. Use it only when server-side requests should target a different internal URL than the browser-facing `NUXT_PUBLIC_SHOPWARE_ENDPOINT`.

`.env` is ignored by git. Only `.env.template` is committed.

### If the storefront breaks against your instance

`nuxt.config.ts` sets `cacheableReads: true`. That reads anonymous Store API data through cacheable GET routes instead of POST, so CDNs and browsers can cache the responses. The module default is `false`, and it needs a backend that supports the GET read routes and the `_criteria` query param. If yours does not, set it to `false`.

## Generate your own API types

After pointing the template at your own instance, regenerate the API types so they match your schema, including any extensions:

```bash
pnpm generate-types
```

This reads `OPENAPI_JSON_URL` and `OPENAPI_ACCESS_KEY` from `.env`. `OPENAPI_JSON_URL` is the base URL of your instance, without the `/store-api/` suffix.

## Styling and Shopping Experiences integration

This template uses [UnoCSS](https://unocss.dev/) for styling and follows a layered setup:

- [`@shopware/cms-base-layer`](https://www.npmjs.com/package/@shopware/cms-base-layer) provides the CMS components for Shopping Experiences
- `@shopware/unocss-design-tokens-layer` provides the shared UnoCSS defaults and design tokens
- the local `uno.config.ts` extends the generated base config with template-specific safelists, fonts, and overrides

## Base or extended?

**Use this template** when you want to start from scratch with minimal setup and maximum flexibility.

**Use [vue-starter-template-extended](../vue-starter-template-extended)** when you want to see a complete implementation, with pre-built pages, a full store theme, and component override patterns. It extends this template as a Nuxt layer.

## Docker

Build and run the production image from this directory:

```bash
docker build -t shopware-vue-starter .
docker run --rm -p 3000:3000 --env-file .env shopware-vue-starter
```

The image reads the same variables as local development, so `--env-file .env` or individual `-e` flags are enough.

You can also bake the configuration in at build time with `--build-arg`, using the same variable names. Build args become defaults inside the image, and values passed to `docker run` still override them.

The template ships a `.dockerignore`, so local `node_modules`, `.nuxt`, `.output` and `.env` files are not copied into the image. This matters:

- your local `.env` must not be baked into the image during `docker build`
- the Shopware instance must be selected at container runtime, through `--env-file` or `-e`

## Fastly and ISR

The template uses Nuxt route rules with ISR for public storefront pages, and sets `Surrogate-Control` headers for CDN caching:

- public storefront routes: `max-age=86400, stale-while-revalidate=86400`
- checkout, account and wishlist routes: `no-store`

Nuxt and Nitro emit these headers. A CDN such as Fastly still has to be configured to respect them for HTML responses, and to bypass caching for responses that set cookies or depend on session-specific SSR.

## Learn more

- [Shopware Frontends documentation](https://developer.shopware.com/frontends/)
- [Vue Starter Template](https://developer.shopware.com/frontends/introduction/templates/vue-starter-template.html)

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-starter-template)
