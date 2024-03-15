---
head:
  - - meta
    - name: og:title
      content: Storefront url
  - - meta
    - name: og:description
      content: "Shopware Frontends Demo Store Template storefront URL handling"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Storefront%20URL.png"
nav:
  position: 30
---

# Storefront URL

Storefront URL is a parameter that is included in some API requests to specify which language, domain, etc., should be used when the backend sends emails.

## Problems

### Local instance

If you are developing a local frontend app using a cloud instance, you may encounter an issue with the wrong storefront URL. For example, the backend may expect http://frontends.shopware.com, but your local instance may be http://127.0.0.1:3000. To address this problem, you can set up host with https://frontends.shopware.com.

`127.0.0.1:3000 http://frontends.shopware.com`

Windows "C:\Windows\System32\drivers\etc".
Linux/macOS "/etc/hosts"

### Preview instance

Another problem that you may encounter is with the preview instance. For example, the backend may expect http://frontends.shopware.com, but your preview instance may be http://1.0.4.frontends.shopware.com. To address this problem, you can set the `devStorefrontUrl` parameter as shown below:

```js
//nuxt.config.ts
shopware: {
  ...
  devStorefrontUrl: 'http://frontends.shopware.com'
},

```

or

```js
//nuxt.config.ts
runtimeConfig: {
    public: {
      shopware: {
        ...
        devStorefrontUrl: 'http://frontends.shopware.com'
      },
    },
  }
```

or, by env variable

```
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL: https://demo-frontends.shopware.store
```
