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

# Troubleshooting

Collection of common issues you may run into while working with Shopware Composable Frontends. If you need help or have other questions, feel free to join the [frontends slack channel](https://shopwarecommunity.slack.com/archives/C050L6NCMGQ).

## Which SalesChannel type to use for Composable Frontends?

Currently you should use the default **Storefront SalesChannel type**. This sounds wrong, but if you using the Headless SalesChannel type you will not have nice speaking seo urls at the moment. Because the generation of seo urls will only be executed for SalesChannels with the type Storefront. We working on a more flexible solution with the core team to not have this confusion in the future.

## How to use https for your localhost with Composable Frontends?

### Option 1: Manual with mkcert

- Make sure you have `mkcert` installed on your system. Otherwise, follow [here](https://github.com/FiloSottile/mkcert) to set it up.
- Create a valid certificate in your project folder by running `mkcert localhost`.
- Update the `nuxt dev` command in your `package.json`.  
  It should look like this: `NODE_TLS_REJECT_UNAUTHORIZED=0 nuxt dev --https --ssl-cert localhost.pem --ssl-key localhost-key.pem`
- Now run your project with `npm run dev` or `pnpm run dev` from your project root.
- Your browser may ask you to accept the risk when you visit https://localhost:3000. This is because it is a self-signed certificate.

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
- Your browser may ask you to accept the risk when you visit https://localhost:3000. This is because it is a self-signed certificate.

## SSR throws error in local environment with DDEV?

If you are using DDEV as a local environment with SSR = true (Nuxt config for routes) and you always get a 500 error message that the context is not provided for category, you may have a problem with the SSL certificate. Try to use `NODE_TLS_REJECT_UNAUTHORIZED = 0` in [.env file](https://nuxt.com/docs/guide/directory-structure/env) (this is a issue with self-signed certificates). To validate if this is your problem: Connect the local Frontend with a valid SSL from a cloud instance and check it against this instance. Also check if you can reach any local store API endpoint with some API client.

## 412 error page during local development?

The HTTP status code 412 (Precondition Failed) usually means in the Shopware `store API` context that the specified `shopwareAccessToken` is incorrect or not correct for the specified `shopwareEndpoint`. Check your `nuxt.config.ts` file, if you do not see an error, please try connecting directly to your `store API` endpoint using an API client.

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
