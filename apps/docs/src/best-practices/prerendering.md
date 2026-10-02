---
head:
  - - meta
    - name: og:title
      content: "Best practices: Prerendering"
  - - meta
    - name: og:description
      content: "Whether the starter template can be generated as a static site, and what you have to configure for it."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Prerendering**.png?fontSize=110px"
nav:
  position: 30
---

# Prerendering

[Server-side generation](./deployment.md#server-side-generation-ssg) explains what a static build gives you. This page answers the narrower question: can `vue-starter-template` be generated, and what do you have to change to make it work.

Yes, and it is a mode of the starter rather than a separate template. Nothing in the application changes: you run `nuxt generate` instead of `nuxt build`, and you add some Nitro configuration.

The starter resolves every storefront URL through one `app/pages/[...all].vue`, which asks the Shopware CMS what to render, so it is reasonable to expect a generator to have no route list to crawl. In practice Nitro starts at the root and follows links, and the catch-all renders whatever it is given.

Crawling proves the catch-all works. It does not give you the catalog. Listing pagination renders as buttons that call `router.push`, not as links, so nothing past the first page of a category is discoverable. A product reachable only through pagination is not discovered unless some other crawlable link points at it. When you need complete product, category and locale coverage, supply the route list yourself from the backend or a sitemap.

## Configuration

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      // This is the setting that matters. Nitro defaults to one page at a
      // time, but Nuxt raises it to four times your CPU count, and each page
      // render fans out into several Store API calls of its own.
      concurrency: 2,
      interval: 200,
      // A retry that lands inside the same window just collects a second
      // rejection, so give it room.
      retryDelay: 2000,
      // Leave Nuxt's `failOnError: true` alone for a build you deploy. Set it
      // to false only to collect diagnostics or inspect partial output.
      // Own the route list once coverage matters, rather than relying on what
      // the rendered HTML happens to link to.
      // crawlLinks: false,
      // routes: ["/", "/some-category"],
    },
  },
  experimental: {
    // The starter ships `false`, which suits the server-rendered deployment it
    // targets but is the wrong default for a static build (warning NUXT_B7015).
    payloadExtraction: true,
  },
});
```

**A green build is not a complete one.** With `failOnError` off, a run that could not render a page still succeeds, and the gap is wider than that page alone: a failed page returns no links, so the crawler never sees anything below it.

Neither common workaround fixes this on its own. A pinned route list closes discovery gaps but says nothing about whether those routes rendered. A page count can match while the wrong page is missing. If you accept partial output, gate the deployment on the routes you require actually existing.

## Limits

Generate against a backend you control. The public demo backend is shared and rate limits aggressively, so a run against it tells you about that backend rather than about your storefront.

Pages are a snapshot. Any price, stock or catalog change invalidates them until you generate again, which is the same trade the [SSG section](./deployment.md#server-side-generation-ssg) describes.

Prerendering does not extend to the parts of the starter that are already client-only. `/checkout`, `/account` and `/wishlist` are set to `ssr: false` in `routeRules` because they are personalized, and they stay client-rendered in a static build too.

`ssr: false` turns off server rendering of the content, not the file. Those routes still get an HTML shell, which the browser fills in. What needs a host fallback is any URL with no file of its own, such as a product that was never prerendered. Publish `.output/public`, configure that fallback, and test a direct request rather than only a click through from the homepage.

The `isr` rule the starter ships does nothing on a static host. There is no server to revalidate, so pages change when you generate again and not before.

Running this as a mode costs no separate template. What it does add is owning a route list, deciding what triggers a regenerate, configuring the host, and smoke testing the output.
