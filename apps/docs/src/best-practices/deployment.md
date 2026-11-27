---
head:
  - - meta
    - name: og:title
      content: "Best practices: Deployment"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you provide a reliable application."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Deployment**.png?fontSize=110px"
nav:
  position: 30
---

# Deployment

Shopware Frontends can be deployed in multiple ways, depending on the setup you are using. Most likely you will be using either a static hosting service or a server with a Node.js runtime. The different options and approaches are described below.

## Static hosting

This option is the easiest to set up and will work best for small or static projects. With a static hosting, your site will be built once during the deployment and afterwards delivered as static HTML pages with Javascript for dynamic elements.

The biggest advantage is that there is no additional server needed to do the rendering of your page and it scales very well\*, because your entire site is made of files on a server.

### Single page application (SPA)

In a single page application the server sends the application as static HTML and Javascript. After receiving the data, the browser will parse the Javascript and the page becomes interactive. It requires an API at runtime to fetch data like products, categories or a navigation.

Drawbacks of this approach are that it is heavy on the API and that initial page loads take the longest, because the browser has to parse the Javascript before anything can be displayed to the user. That delay has a negative impact on UX and search engine scoring.

### Server-side generation (SSG)

In server-side generation your site's pages - products pages, category pages, content pages - are generated once at build time. Afterwards the site will be delivered as static HTML and Javascript to the client.

The main advantage of SSG is, that browsing activities are not affected by your API backend, because it's used to display products, categories etc. - in most cases it is the approach giving the most potential for good performance. For dynamic operations like cart, user account or checkout the API will still be called.

\*The main drawback is that any change of products, categories, etc. will invalidate the generated pages and require you to re-generate them, so this approach is not ideal for sites that change often.

### Popular static hosting services

There are various services that provide static hosting, such as

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Amazon S3](https://aws.amazon.com/s3/)
- and many more

Each services has its own way of deploying your applications and you should refer to their documentation for more information.

## Dynamic hosting (SSR)

The dynamic hosting option requires a Node.js server to run your application. For every fresh page request, the application is rendered on the server in a process called SSR (server-side rendering) and then delivered as static HTML and Javascript to the client. Afterwards, the static page will become interactive after the browser parsed all Javascript in a process called hydration and it continues working like a [SPA](#single-page-application-spa).

It is the most dynamic and versatile approach and requires no invalidation and is generally better for SEO, since the page is visible to the user right away. For most eCommerce projects it is the best fit, bringing together the SEO and UX benefits of SSG and the actuality of SPA.

Drawbacks are that it requires API access at runtime for all operations. These calls are made by the Node.js server and introduce an additional round-trip (Node server>API>Node server) before the page can be fully rendered and sent to the client. For that reason, it is generally advised to optimize your network infrastructure with regard to that round trip in order to get the most out of the SSR approach. Obviously

### Popular dynamic hosting services

- [Vercel](https://vercel.com/)
- [Heroku](https://www.heroku.com/)

## Prepare you application

The final goal is always deployment, no less equal than development itself.

There are many good tools available that help you build and deploy your application.

### Nitro

The great example is [Nitro](https://github.com/unjs/nitro), which is used by default by [Nuxt 3](https://nuxt.com/docs/guide/concepts/server-engine) as its server engine, but can be also used broadly in the whole JS ecosystem.

Moreover, besides the frameworks or libraries that you can work with using Nitro, there are many ready-to-use platforms providers (called _presets_) which help you to build & deploy (docs included) your app with almost zero config:

- azure
- cloudflare_pages
- netlify
- stormkit
- vercel

Nitro provides also really great examples for other well known platforms (full static, or those serving SSR) and the list you can find [here](https://nitro.unjs.io/deploy).

## Credentials and secrets

A Shopware Frontends app talks to two Shopware APIs, and their credentials are handled in opposite ways.

- **The sales channel access key** (`accessToken`, the Store API key) is public by design. The browser sends it with every Store API request, so it belongs in the `shopware` module options or `runtimeConfig.public.shopware`.
- **Admin API integration credentials** (`client_id` / `client_secret`, also called access key ID and secret access key) must never reach the browser. Anyone who holds them gets Admin API access to your shop with the rights of that integration: they can read customer and order data, change prices and products, or create admin users. The same goes for any other server secret, such as payment provider keys or passwords.

### Where secrets belong

Everything under `runtimeConfig.public`, and everything under the `shopware` module key, is serialized into the page payload and sent to every visitor. Keep secrets out of both. Instead:

1. Declare them with empty values in the private part of `runtimeConfig`.
2. Set the real values through `NUXT_*` environment variables in your hosting provider's settings, or a local `.env` file that is not committed. Nuxt maps `runtimeConfig.adminApiClientSecret` to `NUXT_ADMIN_API_CLIENT_SECRET`.
3. Read them only in Nitro `server/` routes, and return only the data the browser needs.

Never put secrets in client code (components, composables, plugins), in `runtimeConfig.public`, under the `shopware` module key, or in any committed file.

<!-- automd:file src="examples/docs-code-examples/src/generated/best-practices/deployment/credentials-and-secrets.ts" code lang="ts" no-name -->

```ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    // Private: available only on the server, never sent to the browser.
    // Leave the values empty and set them at runtime through
    // NUXT_ADMIN_API_ENDPOINT, NUXT_ADMIN_API_CLIENT_ID and
    // NUXT_ADMIN_API_CLIENT_SECRET.
    adminApiEndpoint: "",
    adminApiClientId: "",
    adminApiClientSecret: "",
    public: {
      // Public: serialized into every page. Nothing secret goes here.
    },
  },
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    // The sales channel access key is public by design.
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
});
```

<!-- /automd -->

A server route that uses the Admin API:

<!-- automd:file src="examples/docs-code-examples/src/generated/best-practices/deployment/credentials-and-secrets-2.ts" code lang="ts" no-name -->

```ts
// server/api/has-products.get.ts
import { createAdminAPIClient } from "@shopware/api-client";
import { defineEventHandler } from "h3";

import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async () => {
  // Private runtime config is only readable on the server.
  const config = useRuntimeConfig();

  const adminApiClient = createAdminAPIClient({
    baseURL: String(config.adminApiEndpoint),
    credentials: {
      grant_type: "client_credentials",
      client_id: String(config.adminApiClientId),
      client_secret: String(config.adminApiClientSecret),
    },
  });

  const { data } = await adminApiClient.invoke(
    "searchProduct post /search/product",
    { body: { limit: 1 } },
  );

  // Return only what the browser needs, never the credentials or the token.
  return { found: Boolean(data) };
});
```

<!-- /automd -->

### Safety net in `@shopware/nuxt-module`

The `@shopware/nuxt-module` removes secret-like keys from `runtimeConfig.public.shopware`, at any depth and case-insensitively. It matches names such as `client_id`, `clientSecret`, `password`, `privateKey`, `adminApi*` and anything containing `secret`. It logs a warning with the path of every removed key, never its value. The keys stay in private `runtimeConfig.shopware`. `accessToken`, `endpoint` and `devStorefrontUrl` stay public.

This is a safety net, not a place to keep secrets. It covers only the `shopware` key, not the rest of `runtimeConfig.public` or your own code. If you see the warning, move the key out of the `shopware` options as described above.

### Check a deployed site

Open your storefront in a private window and check what a visitor receives:

- View the page source and search the `__NUXT__` / `__NUXT_DATA__` payload for `client_secret`, `clientSecret`, `secret` and the value of your integration's secret access key.
- In the browser developer tools, open the Network tab, reload, and search all JS bundles for the same strings.

Neither search should find anything. Repeat the check after changing `runtimeConfig` or adding a module.

### After a leak

If an Admin API secret has been in a public payload, a JS bundle or a public repository, treat it as compromised. Removing it from the code is not enough:

1. In the Shopware Administration, go to **Settings > System > Integrations**, delete the leaked integration and create a new one with only the rights it needs.
2. Store the new credentials as private environment variables and redeploy.
3. Check orders, customers, products, prices and admin users for changes you did not make.

## Good Practices

Here are the collected rules that may be followed to avoid most common issues during the deployment.

### Automate the processes

Avoid doing manual work like running tests, building, release. The more work is being done automatically, there is less space for human mistake. Many platforms offer built-in CI/CD servers which help to achieve it for you codebase.

### Use Continuous Integration (CI) tools

Always test your application. Test the build, do the static analyze, and whatever that can detect a potential source of problem in production build.

### Use multiple environments

Test several configurations at the same time, like different nodejs version, or the upcoming release branch with upgraded dependencies. That concerns also the API your application relies on.

### Prepare a checklist

Be prepared, be organized before every roll-out. Deployment checklist shouldn't be to way complicated, but should describe the flow of the work in order to get the deployment done.
