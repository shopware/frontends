# @shopware/webmcp (proof of concept)

Registers storefront tools with the [WebMCP](https://github.com/webmachinelearning/webmcp)
browser API (`document.modelContext`), so an agent running inside the shopper's
browser can search the catalog, read and change the shopper's own cart, and open
checkout. No tool ever places an order.

**Status: proof of concept, private, not published.** WebMCP is a W3C community
group draft in a Chrome origin trial, and the API still moves. Everything that
touches the browser API sits in `src/modelContext.ts`.

## Shape

```
registerWebMcp({ transport, navigate, onCartChanged, pageContext })
        │
        ├─ transport.listTools()      → descriptors, filtered by mode
        ├─ document.modelContext.registerTool(...) per descriptor
        └─ transport.callTool(name, input, { signal, pageContext })
```

Two transports:

- `createLocalTransport({ apiClient, mode })` runs the tools **in the browser
  against the standard Store API** through the app's api-client. Works today,
  with no backend plugin. The tool contract lives in this package.
- `createDispatcherTransport(apiClient)` targets the server-owned dispatcher
  proposed for the Agentic Commerce plugin
  (`/store-api/agentic-commerce/webmcp/tools[/{name}]`). The routes do not exist
  yet; this is the shape only.

A host supplies four seams:

| Seam            | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| `transport`     | where tools come from and how they run                              |
| `navigate`      | maps a frontend-neutral `next.target` to the host's router          |
| `onCartChanged` | refreshes the host's cart state after a write                       |
| `pageContext`   | product, category or search term of the current page, read per call |

## Tools (local transport)

| Tool                   | Mode      | Does                                                  |
| ---------------------- | --------- | ----------------------------------------------------- |
| `search_products`      | read_only | Store API search, compact cards with id, price, link  |
| `get_product`          | read_only | details by id or number; defaults to the current page |
| `get_cart`             | read_only | the shopper's cart: items, total, promotion codes     |
| `add_to_cart`          | shopping  | add by id or number; defaults to the current page     |
| `update_cart_item`     | shopping  | change a line's quantity; `0` removes it              |
| `apply_promotion_code` | shopping  | add a promotion code, report whether it applied       |
| `start_checkout`       | shopping  | report the next step and hand off to the checkout UI  |

Mode `off` registers nothing. The mode is checked when listing and again when
executing, so a stale page cannot run a hidden tool.

## Nuxt (vue-starter-template)

See `templates/vue-starter-template/app/plugins/webmcp.client.ts`. The mode is
`runtimeConfig.public.webMcp.mode` (`NUXT_PUBLIC_WEB_MCP_MODE`). In dev the
handle is exposed as `window.__shopwareWebMcp` so the tools can be tried from
the console without a WebMCP browser:

```js
await __shopwareWebMcp.call("search_products", { query: "chair", limit: 3 });
await __shopwareWebMcp.call("add_to_cart", { productNumber: "CH24-001" });
```

## Testing

```bash
pnpm --filter @shopware/webmcp test
```

Unit tests stub `document.modelContext` and the api-client. A real browser check
needs Chrome with `chrome://flags/#enable-webmcp-testing` or Playwright ≥ 1.64
(`page.webmcp`); the repo's e2e suite is on 1.63.
