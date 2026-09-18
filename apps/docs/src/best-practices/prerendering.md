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

The starter resolves every storefront URL through one `app/pages/[...all].vue`, which asks the Shopware CMS what to render, so it is reasonable to expect a generator to have no route list to crawl. In practice Nitro starts at the root and follows links, which is enough to reach content and catalog pages.

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
      // Nuxt turns this on for generate. Left on, a single transient error
      // throws away an otherwise complete build.
      failOnError: false,
      // A retry that lands inside the same window just collects a second
      // rejection, so give it room.
      retryDelay: 2000,
      // Optional. Set both if you want output that does not depend on what
      // the homepage happens to link to.
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

**Check what you shipped, not just the exit code.** `failOnError: false` turns a hard stop into a quiet partial result, and the gap is bigger than the failed pages alone. A page that failed to render returns no links, so the crawler never discovers anything below it. A green build can produce a smaller site than a build that stopped early. Either pin the route list, or compare the page count against what you expect before you deploy.

## Limits

Generate against a backend you control. The public demo backend is shared and rate limits aggressively, so a run against it tells you about that backend rather than about your storefront.

Pages are a snapshot. Any price, stock or catalog change invalidates them until you generate again, which is the same trade the [SSG section](./deployment.md#server-side-generation-ssg) describes.

Prerendering does not extend to the parts of the starter that are already client-only. `/checkout`, `/account` and `/wishlist` are set to `ssr: false` in `routeRules` because they are personalized, and they stay client-rendered in a static build too.
