# Lumora Demo Store - Extended Vue Starter Template

**Lumora – Modern Home Scents**

A Shopware Frontends template showcasing a modern e-commerce store for home fragrances (candles, reed diffusers, and room sprays). This template extends the `vue-starter-template` as a Nuxt layer.

**[Live Demo →](https://frontends-extended-starter-template.vercel.app/)**

## When to Use This Template

**Use vue-starter-template-extended if:**

- You need examples of component customization and overrides
- You're building a similar e-commerce store and want a head start
- You need a reference for styling, CMS integration, and Nuxt layer usage

**Use [vue-starter-template](../vue-starter-template) (base) if:**

- You're starting a project from scratch with your own design
- You want minimal boilerplate and maximum flexibility
- You prefer to build everything yourself without pre-built examples
- Your store requires a completely custom structure

## Setup

Install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Template Architecture

This template uses the **Nuxt Layer** pattern by extending `vue-starter-template`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  // ... Lumora-specific configuration
});
```

### Benefits of Layer Approach

- Inherits all composables, pages, and features from vue-starter-template
- Minimal code duplication
- Easy to customize and override specific components
- Automatic updates when base template improves

### Component Inheritance

All components from vue-starter-template are automatically available in Lumora thanks to the layer's component registration using `createResolver`. This includes:

- SEO page resolvers in `app/components/global/` (`FrontendNavigationPage`, `FrontendDetailPage`, `FrontendLandingPage`) — Nuxt global for `resolveComponent`
- Custom/override CMS blocks & elements in `app/components/cms/` — also global for CMS `resolveComponent`
- Layout, form, and shared components under `app/components/` — normal auto-import

When overriding base components, put files in the same subdirectory so names and dynamic resolution keep working (e.g. override `FrontendDetailPage` under `components/global/`, not the components root).

## CMS Integration

The Shopware CMS backend includes:

### Homepage Structure

1. **Hero Section** - Full-width banner with lifestyle imagery
2. **USP Section** - Three-column feature highlights
3. **Category Highlights** - Three tiles for product categories
4. **Featured Products Slider** - Curated product showcase
5. **Editorial Block** - "Why Lumora?" brand story

### Custom CSS Classes

The template includes pre-configured styles for CMS blocks:

- `.lumora-separator` - horizontal divider for CMS sections (defined as an UnoCSS shortcut in `uno.config.ts`)

These can be applied directly in the Shopware CMS admin panel.

## Customization

### Override Components

Create components in `./app/components/` to override base template components (match `global/` / `cms/` when overriding resolveComponent targets):

```
lumora-demo-store/
  app/
    components/
      global/
        FrontendDetailPage.vue  # Overrides SEO PDP resolver
      YourCustomComponent.vue   # Overrides base auto-imported component
```

### Add Lumora-Specific Pages

Create pages in `./app/pages/`:

```
lumora-demo-store/
  app/
    pages/
      about.vue  # Custom about page
```

### Styling

Customize UnoCSS configuration in `uno.config.ts` to add Lumora-specific styles.

## Agent Tools (WebMCP)

Lumora registers shop tools for AI agents in the browser with [WebMCP](https://webmachinelearning.github.io/webmcp/), a proposed web API that Chrome tests behind a flag. An agent can search, open a category, read a product, change the cart and open checkout. Searches and categories open on the page, and cart changes show in the cart. A small status line names every step, also the ones that change nothing on the page. No tool places an order. The shopper does that on the checkout page, and the cart and checkout pages have no tools.

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

1. In Chrome 153 or newer, enable `chrome://flags/#enable-webmcp-testing` and restart Chrome.
2. Run `pnpm dev` and open the shop.
3. In DevTools, open **Application > WebMCP** to list the tools and run them.
4. To shop by chat, use an agent extension such as [webmcp-extension](https://github.com/GoogleChromeLabs/webmcp-extension) or the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd). webmcp-extension needs Chrome 155 or newer, and its model server also uses port 3000, so start and build it with `PORT=4000`. Coding agents can use the [Chrome DevTools MCP server](https://github.com/ChromeDevTools/chrome-devtools-mcp) with `--categoryExperimentalWebmcp --chromeArg=--enable-features=WebMCP`.

How it works:

- `app/plugins/webMcpTools.client.ts` registers the tools when the app starts. An agent sees them before the page hydrates, and a call made that early waits for the page.
- `app/utils/webmcp/tools.ts` is the list an agent sees: names, titles, descriptions and inputs. Titles come in the page language. The tools whose ids feed later calls also declare the shape of their answer (`outputSchema`, Chrome 159 and newer). Error answers match it too.
- `app/components/WebMcpTools.client.vue` holds what each tool does and shows the status line. `app/layouts/default.vue` adds it to the starter's default layout. `app/utils/webmcp/answers.ts` builds the answers and reads the agent's input.
- `app/utils/webmcp/register.ts` runs the calls one at a time and answers each one within 30 seconds. When a call is cancelled, runs out of time, or the shopper goes on to checkout, it stops before its next change to the cart or the page. A request that hangs blocks the next call for at most 60 seconds.

To add a tool, describe it in the list and write its handler in the component. The typecheck fails when the two do not match. `pnpm test` runs the unit tests next to each file in `app/utils/webmcp/`.

A problem comes back as `{ "error": "..." }` with a next step, because the browser hides thrown errors from the agent. Lists and error texts are cut so that an answer stays under 1,500 characters, as Chrome advises, and `total` gives the full count. A search or category call reads the list for the agent, and the page reads it again. Browsers without WebMCP ignore all of this.

To offer the tools without a browser flag, register your shop's address for Chrome's [WebMCP origin trial](https://developer.chrome.com/origintrials/#/register_trial/4163014905550602241) and set the token as `NUXT_PUBLIC_WEBMCP_ORIGIN_TRIAL`. `server/plugins/webmcpOriginTrial.ts` puts it into every page. The trial covers Chrome 149 to 162 on desktop.

Checked with Chrome 157, 158 and 159 and the WebMCP draft of 13 November 2026.

## Next Steps

Optional enhancements:

- Build custom "About Lumora" page
- Create custom CMS layouts for PDP and category pages
- Add Nuxt components for CMS block overrides
- Integrate product reviews
- Add gift wrapping options

## Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Shopware Frontends Documentation](https://developer.shopware.com/frontends)
- [UnoCSS Documentation](https://unocss.dev/)
