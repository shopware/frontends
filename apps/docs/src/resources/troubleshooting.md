---
head:
  - - meta
    - name: og:title
      content: Troubleshooting - Shopware Composable Frontends
  - - meta
    - name: og:description
      content: "Collection of common issues you may run into while working with Shopware Composable Frontends."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Troubleshooting?fontSize=150px"
---

# 😱 Troubleshooting

Collection of common issues you may run into while working with Shopware Composable Frontends. If you need help or have other questions, feel free to join the [frontends slack channel](https://shopwarecommunity.slack.com/archives/C050L6NCMGQ).

## Which SalesChannel type to use for Composable Frontends?

Currently you should use the default **Storefront SalesChannel type**. This sounds wrong, but if you using the Headless SalesChannel type you will not have nice speaking seo urls at the moment. Because the generation of seo urls will only be executed for SalesChannels with the type Storefront. We working on a more flexible solution with the core team to not have this confusion in the future.

## The access token for the store API is public visible?

In general, the store API should only output content that would also be visible on a standard storefront. Therefore, do not output any sensitive data to the store API. For our vue-demo-store template, we decided to use a public access token, also to have a simple configuration. However, this does not mean that you should do the same in a production environment. To secure your access token, you can use [proxy api requests](#proxy-api-requests) also have a look at our [community modules](../resources/community-modules/) how others are doing this.

## How to use https for your localhost with Composable Frontends?

### Option 1: Manual with mkcert

- Make sure you have `mkcert` installed on your system. Otherwise, follow [here](https://github.com/FiloSottile/mkcert) to set it up.
- Create a valid certificate in your project folder by running `mkcert localhost`.
- Update the `nuxt dev` command in your `package.json`.  
  It should look like this: `NODE_TLS_REJECT_UNAUTHORIZED=0 nuxt dev --https --ssl-cert localhost.pem --ssl-key localhost-key.pem`
- Now run your project with `npm run dev` or `pnpm run dev` from your project root.
- Your browser may ask you to accept the risk when you visit `https://localhost:3000`. This is because it is a self-signed certificate.

### Option 2: Vite plugin

- Execute `pnpm add -D @vitejs/plugin-basic-ssl` in your project folder
- Edit your `nuxt.config.ts` file and add:
  ```ts
  import basicSsl from '@vitejs/plugin-basic-ssl'
  // https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
  export default defineNuxtConfig({
  // ...
  devServer: {
    https: true,
  },
  vite: {
    plugins: [
      basicSsl(),
    ],
  },
  // ...
  ```
- Start your dev server with `pnpm run dev`
- Your browser may ask you to accept the risk when you visit `https://localhost:3000`. This is because it is a self-signed certificate.

## SSR throws error in local environment with DDEV?

If you are using DDEV as a local environment with SSR = true (Nuxt config for routes) and you always get a 500 error message that the context is not provided for category, you may have a problem with the SSL certificate. Try to use `NODE_TLS_REJECT_UNAUTHORIZED = 0` in [.env file](https://nuxt.com/docs/guide/directory-structure/env) (this is a issue with self-signed certificates). To validate if this is your problem: Connect the local Frontend with a valid SSL from a cloud instance and check it against this instance. Also check if you can reach any local store API endpoint with some API client.

## 412 error page during local development?

The HTTP status code 412 (Precondition Failed) usually means in the Shopware `store API` context that the specified `accessToken` is incorrect or not correct for the specified `endpoint`. Check your `nuxt.config.ts` file, if you do not see an error, please try connecting directly to your `store API` endpoint using an API client.

```ts
// a part of nuxt.config.ts

  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW", // access token for corresponding sales channel
    endpoint: "https://demo-frontends.shopware.store/store-api/", // endpoint where store-api is available
    devStorefrontUrl: "", // to simulate a storefrontUrl which is used in registration process and should cover the domain settings for a sales channel
  },

```

## Access from origin 127.0.0.1:3000 has been blocked by CORS policy

Depending on your server, you may need to set the `Access-Control-Allow-Origin` header to access your server from an external origin. And yes, your local development server is also an external origin in this case. Also, have a look at this [documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin) from MDN.

## Proxy API requests

If you're encountering issues related to Cross-Origin Resource Sharing (CORS) or if you wish to conceal the backend API URL, you can use Vite's proxy mechanism

### Nuxt example

Edit your `nuxt.config.ts` file and add:

```
  vite: {
    server: {
      proxy: {
        "/store-api": {
          target: "<backend url>",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
```

Modify the Shopware API endpoint to match your local frontend URL.

```
  {
    ...
      shopware: {
          endpoint: "<frontends >store-api/",
          ...
      }
  }
```

## Broadcasting and BFCache Compatibility

### Issue

When Broadcasting is enabled, the BFCache (Back-Forward Cache) functionality is not operational. This incompatibility can lead to suboptimal performance and user experience when navigating back and forth between pages.

### Resolution (vue-demo template)

To leverage the benefits of BFCache, we have decided to disable Broadcasting. By turning off Broadcasting, we ensure that the BFCache can function correctly, providing a smoother and faster navigation experience for users.

```
...
runtimeConfig: {
  broadcasting: true,
},
...
```

### Additional Information

BFCache is a browser optimization that allows pages to be stored in memory, enabling instant loading when users navigate back or forward. While Broadcasting is useful for real-time updates, its current implementation conflicts with BFCache. Disabling Broadcasting allows us to prioritize the performance improvements offered by BFCache.

For more details on BFCache, refer to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Navigation_and_resource_timing#bfcache), [WHATWG](https://github.com/whatwg/html/issues/7253)

## CORS (Cross-Origin Resource Sharing) Issues

See the [CORS](./troubleshooting/CORS) page for more information on how to handle CORS issues in your project.