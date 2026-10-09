# React starter template

A Next.js App Router storefront template for Shopware 6, the React counterpart
of `vue-starter-template`. It is at the skeleton stage and is not ready to start
a project from.

## Stack

- Next.js 16.3 with the App Router and Cache Components
- React 19
- `@shopware/api-client` with the Store API types, `@shopware/helpers`
- Tailwind CSS v4 with the Shopware color tokens from `@shopware/design-tokens`

## Development

From the repository root:

```bash
pnpm i
pnpm --filter react-starter-template dev
```

Then open http://localhost:3000.

## Connecting your own Shopware instance

The template runs against the public demo backend without any configuration.
To use your own instance, copy `.env.template` to `.env` and set:

| Variable                      | Value                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `SHOPWARE_ENDPOINT`           | Store API endpoint, e.g. `https://your-shop.com/store-api/`                                                                   |
| `SHOPWARE_ACCESS_TOKEN`       | Sales Channel access key (Settings > Sales Channel > API access)                                                              |
| `SHOPWARE_PUBLIC_ENDPOINT`    | Store API endpoint the browser calls, if it differs from `SHOPWARE_ENDPOINT` (the default)                                    |
| `SHOPWARE_DEV_STOREFRONT_URL` | `storefrontUrl` sent with a registration instead of the page origin, for local development only; leave it empty in production |

All of them are read on the server at request time, so one build can serve
several environments. The browser gets the public ones from
`/api/shopware/config`.

## Languages

The storefront ships the Vue starter's translations for `en-GB` (the default,
served without a URL prefix), `pl-PL` (`/pl-PL/…`) and `de-DE` (`/de-DE/…`).
A locale also switches the Shopware content language when your instance has
a language whose translation code equals it; otherwise the default language
of the sales channel is used and only the interface labels change. When the
sales channel has more than one language, a language switcher appears above
the header.

The files in `i18n/<locale>/` are shared with the Vue starter; texts only this
template needs live in `i18n/<locale>/react/`.

## Type generation

The Store API types come from `@shopware/api-client`. To include the endpoints
and fields of your own instance and its extensions, set `OPENAPI_JSON_URL` and
`OPENAPI_ACCESS_KEY` in `.env`, then run:

```bash
npx shopware-api-gen loadSchema --apiType=store
pnpm --filter react-starter-template generate-types
```

Point `shopware.d.ts` at the generated `./api-types/storeApiTypes` afterwards.
