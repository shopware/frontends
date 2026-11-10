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
- `/sitemap.xml`, an index of the sitemap files Shopware generates, served from this host. The page URLs inside come from the sales channel domain, so point that domain at the storefront's public URL. On a headless sales channel from Shopware 6.7.15, also turn on **External storefront** for it. Behind a proxy that rewrites the Host header, set `NUXT_PUBLIC_SITE_URL`.
- A `Dockerfile` for production builds

## Requirements

Go to [Documentation > Requirements](https://developer.shopware.com/frontends/introduction/requirements.html) to see the details.

Node `^22.22.3 || ^24.15.0 || >=26.0.0`, the range in `package.json`. This
repository uses pnpm.

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
pnpm run dev --filter=vue-starter-template
```

The dev server runs on `http://localhost:3000`. Use `pnpm build` for a production build, then `pnpm preview` to serve it locally.

## Set up your Shopware 6 instance

Out of the box the template talks to a public demo shop. To use your own, copy the env template and fill it in:

```bash
cp .env.template .env
```

Two values must be set. `nuxt.config.ts` defaults them to the public demo shop, so a fresh checkout runs. Point them at your own instance, and never leave either one empty - the app throws on startup if one is missing:

- `NUXT_PUBLIC_SHOPWARE_ENDPOINT` - your Store API endpoint, including the `/store-api/` suffix
- `NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN` - the sales channel access token, found in the Shopware admin under Settings > Sales Channel > API access

`.env.template` documents the optional values too. Two are worth knowing about:

`NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL` is mainly useful for local development when the Shopware sales channel domain does not match `localhost`. For the public demo backend it is `https://demo-frontends.shopware.store/figma`, the only domain that sales channel lists. In production, leave it empty unless you specifically need to override it.

`NUXT_SHOPWARE_ENDPOINT` is optional. Use it only when server-side requests should target a different internal URL than the browser-facing `NUXT_PUBLIC_SHOPWARE_ENDPOINT`.

`.env` is ignored by git. Only `.env.template` is committed.

### If the storefront breaks against your instance

`nuxt.config.ts` sets `cacheableReads: true`. Fresh guest sessions then read through cacheable GET routes. CDNs and browsers can cache those. Every other session uses POST, for example logged-in customers or a filled cart. The module default is `false`. It needs Shopware 6.7.6 or newer. On an older instance, set it to `false`.

## Generate your own API types

The template uses the types shipped with `@shopware/api-client` until you point it at your own instance. After that, regenerate the API types so they match your schema, including any extensions:

```bash
npx shopware-api-gen loadSchema --apiType=store
pnpm generate-types
```

Both read `OPENAPI_JSON_URL` and `OPENAPI_ACCESS_KEY` from `.env`. `OPENAPI_JSON_URL` is the base URL of your instance, without the `/store-api/` suffix.

Run `loadSchema` first. On its own, `generate-types` falls back to the published default types, which do not include your instance's extensions. Then switch `shopware.d.ts` from `@shopware/api-client/store-api-types` to `./api-types/storeApiTypes`.

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

## Agent checkout handoff (UCP)

Agents that shop without a browser, for example through the Store API MCP server of the [agentic-commerce plugin](https://github.com/shopware/agentic-commerce), build a cart over UCP and hand the buyer a `continue_url`. The template receives that link and continues the same cart in the shop.

| Path                                                          | What it does                                                                                                                                                |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/checkout/continue/{token}`                                  | Target of the UCP `continue_url`. Asks the buyer to confirm, then adopts the agent's cart as the session (`sw-context-token` cookie) and opens `/checkout`. |
| `/.well-known/ucp`, `/.well-known/agent-card.json`, `/ucp/**` | Proxied to Shopware, so agents discover and call UCP on the shop's own domain. Shopware needs to trust this server as a proxy, see below.                   |

All of it is off until `NUXT_PUBLIC_AGENTIC_HANDOFF_ENABLED=true` is set. The link opens a page that asks the buyer to continue with the agent's cart. Continuing replaces the browser's session: an existing cart goes away, and a signed-in customer is signed out. The page says so first. A link whose session is signed in to a customer account is refused, so a link cannot sign the buyer in to someone else's account. When a link cannot be used, or the shop cannot be reached, the buyer lands on the cart with a notice. The link stays usable as long as the agent's cart exists: the plugin puts the cart's own token in `continue_url` and does not issue single-use codes yet.

The public demo backend has no UCP. To try it against your own Shopware:

1. Enable UCP on the sales channel and point its continue URL at this shop. Shopware builds `continue_url` from that template, per sales channel:

   ```bash
   bin/console ucp:setup --sales-channel=<name> --dev
   bin/console ucp:config:set --sales-channel=<name> --continue-url-template='http://localhost:3000/checkout/continue/{checkoutId}'
   ```

2. If Shopware answers the proxied requests with its domain-mapping error, let it trust this server as a proxy: `SYMFONY_TRUSTED_PROXIES=127.0.0.1,::1` and `SYMFONY_TRUSTED_HEADERS=x-forwarded-for,x-forwarded-host,x-forwarded-proto,x-forwarded-port` in its environment. Shopware's MCP endpoint also checks the upstream `Host` header, so the hostname of the Store API endpoint must be one of Shopware's allowed MCP hosts.
3. Point `.env` at that instance, see above, set `NUXT_PUBLIC_AGENTIC_HANDOFF_ENABLED=true` and run `pnpm dev`.
4. Run the end-to-end checks against it. The storefront host has to be one of the sales channel's domains, or the UCP calls behind the proxy fail. `E2E_REQUIRE_UCP=1` makes the UCP journey fail instead of skip when the shop turns out to have no UCP:

   ```bash
   cd apps/e2e-tests
   E2E_REQUIRE_UCP=1 BASE_E2E_URL=http://localhost:3000/ pnpm exec playwright test tests/agenticHandoff --project=chromium
   ```

In production, set `NUXT_AGENTIC_HANDOFF_STOREFRONT_HOSTS` to the shop's hosts. The server warns at startup while the handoff is on and the list is empty. Shopware resolves the sales channel from the host the proxy forwards, for discovery and for every UCP call, and builds `continue_url` from that channel's template. The proxy and the continue page answer only on the listed hosts, so a request cannot pick another channel. All of those hosts must belong to the sales channel of the configured access key: discovery, the adopt route and the browser use that one channel.

Behind a CDN or load balancer, Shopware sees the edge as the caller of every proxied request, so its MCP rate limit counts all agents as one. Host and protocol are read from the forwarding headers the edge sends, so the edge has to replace the ones it receives, and it has to be the only way to reach this server.

## Learn more

- [Shopware Frontends documentation](https://developer.shopware.com/frontends/)
- [Vue Starter Template](https://developer.shopware.com/frontends/introduction/templates/vue-starter-template.html)

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-starter-template)
