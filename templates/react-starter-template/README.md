# React starter template

A Next.js App Router storefront template for Shopware 6, the React counterpart
of `vue-starter-template`. It is at the skeleton stage and is not ready to start
a project from.

## Stack

- Next.js 16.4 with the App Router and Cache Components
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

| Variable                      | Value                                                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SHOPWARE_ENDPOINT`           | Store API endpoint, e.g. `https://your-shop.com/store-api/`                                                                                                                                                         |
| `SHOPWARE_ACCESS_TOKEN`       | Sales Channel access key (Settings > Sales Channel > API access)                                                                                                                                                    |
| `SHOPWARE_PUBLIC_ENDPOINT`    | Store API endpoint the browser calls, if it differs from `SHOPWARE_ENDPOINT` (the default)                                                                                                                          |
| `SHOPWARE_DEV_STOREFRONT_URL` | `storefrontUrl` sent with a registration instead of the page origin, for local development only; leave it empty in production                                                                                       |
| `SHOPWARE_API_TIMEOUT`        | Timeout in whole milliseconds for every Store API call the server makes, `10000` when empty; `0` turns it off. Calls with a timeout of their own keep it                                                            |
| `SHOPWARE_API_HEADERS`        | JSON object of extra headers for the server's Store API calls, e.g. `{"Authorization":"Basic …"}` for HTTP basic auth or a WAF bypass header. Never sent to the browser                                             |
| `SHOPWARE_PUBLIC_API_HEADERS` | JSON object of extra headers the browser sends with its Store API calls. Every visitor can read them, so never put a secret here. The server sends them too, and `SHOPWARE_API_HEADERS` wins for a name set in both |
| `STOREFRONT_URL`              | Public origin of this storefront (e.g. `https://shop.example.com`) for absolute canonical links, Open Graph URLs and structured data; without it canonical links are relative                                       |

All of them are read on the server at request time, so one build can serve
several environments. The browser gets only the public endpoint, the access
token, `SHOPWARE_DEV_STOREFRONT_URL` and `SHOPWARE_PUBLIC_API_HEADERS`, from
`/api/shopware/config`.

Header names are case-insensitive and are sent lowercased. A header the
Store API client or the HTTP connection sets itself (every `sw-*` name,
`accept`, `content-type`, `content-length`, `host`, `connection` and the
other hop-by-hop headers) is ignored, and so are headers browsers refuse to
send (`cookie`, `origin`, `referer`, `proxy-*`, `sec-*`) in
`SHOPWARE_PUBLIC_API_HEADERS`. Invalid JSON, a value that is not a string and
an unusable timeout are ignored too: the storefront logs one warning that
names the variable or the header, never its value, and keeps running. The
browser has no configurable timeout; its reads give up after 10 seconds and
placing an order after 60.

Browser calls are cross-origin, so CORS limits `SHOPWARE_PUBLIC_API_HEADERS`.
Shopware's preflight answer allows only `Content-Type`, `Authorization` and
its own `sw-*` headers, so a custom header such as `x-edge-region` blocks
every browser call until Shopware allows it (a service implementing
`CorsHeaderProviderInterface`) or the proxy in front of Shopware answers the
`OPTIONS` request with it. Server calls are not subject to CORS. Prefer
`Authorization` for a secret in `SHOPWARE_API_HEADERS`: on a redirect to
another origin it is dropped, while a custom header is sent along.

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
