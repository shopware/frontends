# vue-agentic-handoff - agent notes

A Nuxt layer on top of `vue-starter-template` that takes over checkouts an AI
agent started over UCP.

What the template adds, how the flow runs and how to set up Shopware are in
[README.md](README.md). The file layout is discoverable from `server/` and
`app/`. This file holds only what neither makes obvious.

## Every route this template adds must stay uncached

The starter caches `/**` with 24-hour ISR. Every route here either proxies
Shopware or sets a session cookie on a GET, so none of them may be cached.
`nuxt.config.ts` keeps one `uncached` object and applies it per route in
`routeRules`. Add new routes there in the same change. All three parts matter:
`isr: false` opts out of the starter's ISR on Vercel, `cache: false` out of
Nitro's route cache on any preset, and the headers stop CDNs and browsers.

## The host the proxy reports is a security boundary

Shopware builds every URL it hands to the agent from the host it sees: the
endpoints in the UCP profile, the `continue_url` and the order permalink. That
is why `server/middleware/ucp-proxy.ts` forwards the storefront host. Drop it
and the agent gets URLs pointing at Shopware, so the buyer never reaches this
template.

Take it from `getStorefrontHost()`, never from the request. `X-Forwarded-Host`
is attacker-controlled, and `continue_url` carries a session token, so a
spoofed header hands that token to another domain. The configured hosts also
gate the continue route through `isStorefrontHost()`.

## Check the UCP path after normalizing it

`isUcpPath()` is a string test, and the URL is normalized later. `/ucp/%2e%2e/x`
passes the string test and resolves to `/x` on the Shopware origin, which would
turn this storefront into an open proxy to the backend. Browsers do not decode
`%2e`, so it reaches the server intact. `resolveUcpTarget()` resolves the URL
first, rejects anything that leaves the Shopware origin, and only then tests the
pathname. Proxy its result, not `event.path`.

## The token in the continue URL is a session credential

`{checkoutId}` in the `continue_url` is the Shopware context token of the
agent's cart, and the continue route adopts it as `sw-context-token`. Anyone
holding that URL holds the session. Keep the `no-store`, `no-referrer` and
`noindex` response headers on the route, and never log the token or pass it on
in a redirect target.

## A new handoff reason needs three edits

Adding a `?handoff=<reason>` case means touching all of:

1. the redirect in `server/routes/checkout/continue/[token].get.ts`,
2. `REASONS` in `app/plugins/handoff-notice.client.ts`,
3. an `agenticHandoff.<reason>` key in every file under `i18n/locales/`.

Miss the plugin and the buyer sees no message. Miss a locale and that buyer
gets English, because the starter sets `fallbackLocale: "en-GB"`. Miss `en-GB`
as well and the raw key shows up on the page.

## The demo backend cannot exercise this

The public demo backend has no UCP, so the proxied routes have nothing behind
them and the continue route finds no cart. A handoff change that "works" there
proves nothing. Test against a Shopware instance with the agentic-commerce
plugin and a `continueUrlTemplate`, as described in [README.md](README.md).

## The known gaps are Shopware-side

The gaps listed at the end of the README (token rotation on login or order
placement, the order not linked back to the UCP checkout, buyer details missing
from the Store API) are open upstream. They are not bugs in this template, and
working around them here would hide them.
