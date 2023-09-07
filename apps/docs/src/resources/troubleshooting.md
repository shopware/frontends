---
head:
  - - meta
    - name: og:title
      content: Troubleshooting - Shopware Frontends
  - - meta
    - name: og:description
      content: "Collection of common issues you may run into while working with Shopware Composable Frontends."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Troubleshooting?fontSize=150px"
---

# Troubleshooting

Collection of common issues you may run into while working with Shopware Composable Frontends. If you need help or have other questions, feel free to join the [frontends slack channel](https://shopwarecommunity.slack.com/archives/C050L6NCMGQ).

## Which SalesChannel type to use for Frontends?

Currently you should use the default **Storefront SalesChannel type**. This sounds wrong, but if you using the Headless SalesChannel type you will not have nice speaking seo urls at the moment. Because the generation of seo urls will only be executed for all SalesChannels with the type Storefront. We working on a more flexible solution with the core team to not have this confusion in the future.

## SSR throws error in local environment with DDEV?

If you are using DDEV as a local environment with SSR = true (Nuxt config for routes) and you always get a 500 error message that the context is not provided for category, you may have a problem with the SSL certificate. Try to use `NODE_TLS_REJECT_UNAUTHORIZED = 0` in [.env file](https://nuxt.com/docs/guide/directory-structure/env) (this is a issue with self-signed certificates). To validate if this is your problem: Connect the local Frontend with a valid SSL from a cloud instance and check it against this instance. Also check if you can reach any local store API endpoint with some API client.
