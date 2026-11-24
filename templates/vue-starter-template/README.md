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

## Agent Tools (WebMCP)

The starter registers shop tools for AI agents in the browser with [WebMCP](https://webmachinelearning.github.io/webmcp/), a proposed web API that Chrome tests behind a flag. An agent can search, open a category, read a product, change the cart and open checkout. Searches and categories open on the page, and cart changes show in the cart. A small status line names every step, also the ones that change nothing on the page. No tool places an order. The shopper does that on the checkout page, and the cart and checkout pages have no tools.

The tools are off by default. Set `NUXT_PUBLIC_WEBMCP_ENABLED=true` to offer them.

| Tool               | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `search_products`  | Searches product names and shows the results       |
| `browse_category`  | Opens a category, with an optional price range     |
| `get_product`      | Reads one product, or the one on screen            |
| `add_to_cart`      | Adds a product and shows the usual cart message    |
| `get_cart`         | Reads the cart                                     |
| `update_cart_item` | Changes a quantity, 0 removes the item             |
| `go_to_checkout`   | Opens checkout, where the shopper places the order |

To try it:

1. In Chrome 157 or newer, enable `chrome://flags/#enable-webmcp-testing` and restart Chrome.
2. Run `NUXT_PUBLIC_WEBMCP_ENABLED=true pnpm dev` and open the shop.
3. In DevTools, open **Application > WebMCP** to list the tools and run them.
4. To shop by chat, use an agent extension such as [webmcp-extension](https://github.com/GoogleChromeLabs/webmcp-extension) or the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd). webmcp-extension needs Chrome 155 or newer, and its model server also uses port 3000, so start and build it with `PORT=4000`. Coding agents can use the [Chrome DevTools MCP server](https://github.com/ChromeDevTools/chrome-devtools-mcp) with `--categoryExperimentalWebmcp --chromeArg=--enable-features=WebMCP`.

How it works:

- `app/plugins/webMcpTools.client.ts` registers the tools when the app starts. An agent sees them before the page hydrates, and a call made that early waits for the page.
- `app/utils/webmcp/tools.ts` is the list an agent sees: names, titles, descriptions and inputs. Titles come in the page language. `search_products`, `browse_category` and `get_cart` also declare the shape of their answer (`outputSchema`, Chrome 159 and newer). Error answers match it too.
- `app/utils/webmcp/handlers.ts` holds what each tool does. `app/components/WebMcpTools.client.vue` passes it the shop's composables and shows the status line. `app/layouts/default.vue` renders it on every default-layout page. `app/utils/webmcp/answers.ts` builds the answers and reads the agent's input. Cart tools wait up to 10 seconds for the page's first cart read. A tool never moves a shopper who opened another page after the agent made the call.
- `app/utils/webmcp/register.ts` runs the calls one at a time and answers each one within 30 seconds. When a call is cancelled, runs out of time, or the shopper goes on to checkout, it stops before its next change to the cart or the page. A call that hangs holds up the calls after it for at most 60 seconds.

To add a tool, describe it in the list, add its German and Polish titles, and write its handler in `handlers.ts`. The typecheck fails when they do not match. A handler must check `stop` before it changes the cart or the page. `pnpm test` runs the unit tests next to each file in `app/utils/webmcp/`. The e2e spec `apps/e2e-tests/tests/webMcpTools.spec.ts` (tag `@webmcp`) needs a shop started with `NUXT_PUBLIC_WEBMCP_ENABLED=true`.

A problem comes back as `{ "error": "..." }`, because the browser hides thrown errors from the agent. Most errors also say what to do next. Lists and error texts are cut so that an answer stays under 1,500 characters, as Chrome advises, and a product list gives the full count in `total`. A search or category call reads the list for the agent, and the page reads it again. Browsers without WebMCP never run the tool code. Nuxt only prefetches it, about 6 KB, when the browser is idle. If that download fails, the shop works without the tools.

To offer the tools without a browser flag, turn them on, register your shop's address for Chrome's [WebMCP origin trial](https://developer.chrome.com/origintrials/#/register_trial/4163014905550602241) and set the token as `NUXT_PUBLIC_WEBMCP_ORIGIN_TRIAL`. `server/plugins/webmcpOriginTrial.ts` puts it into every page. The trial covers Chrome 149 to 162 on desktop.

Checked with Chrome 157, 158 and 159 and the WebMCP draft of 13 November 2026.

## Learn more

- [Shopware Frontends documentation](https://developer.shopware.com/frontends/)
- [Vue Starter Template](https://developer.shopware.com/frontends/introduction/templates/vue-starter-template.html)

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-starter-template)
