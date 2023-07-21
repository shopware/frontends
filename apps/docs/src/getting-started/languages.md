---
head:
  - - meta
    - name: og:title
      content: "Work with languages"
  - - meta
    - name: og:description
      content: "How to build multi languages site"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Work%20with%20**languages**.png?fontSize=150px"
---

# Work with languages

:::warning
This is the implementation working with `vue-demo-store` template only. To see the details, please go to the `templates/vue-demo-store` directory in the repository.
:::
Each store has two sources of translations.

Backend source for:

- CMS translations
- Product and categories
- Routing paths

Frontend source for:

- All static content declared on the frontend app

## Configuration

More about backend translations can be found [here](https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/translations)

For the frontend app we recommend to use `vue-i18n` module.

**_When you are using same domain:_**

:::warning
Backend languages codes and frontend languages codes must be the same!
:::

```
www.example.com         // GB site
www.example.com/de-DE   // DE site
```

```
{
  i18n: {
    vueI18n: {
      fallbackLocale: "en-GB",
    },
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    langDir: "i18n/src/",
    locales: [
    {
      code: "en-GB",
      iso: "en-GB",
      file: "en-GB.ts",
    },
    {
      code: "de-DE",
      iso: "de-DE",
      file: "de-DE.ts",
    },
  ],
  },
}
```

**_When you are using different domains:_**

```
www.example1.com     // GB site
www.example2.com     // DE site
```

```
{
  i18n: {
    vueI18n: {
      fallbackLocale: "en-GB",
    },
    langDir: "i18n/src/",
    locales: [
    {
      domain: 'example1.com'
      code: "en-GB",
      iso: "en-GB",
      file: "en-GB.ts",
    },
    {
      domain: 'example2.com'
      code: "de-DE",
      iso: "de-DE",
      file: "de-DE.ts",
    },
  ],
  },
}
```

## Routing

When you are using _prefix_ domain languages, you have to use `formatLink()` method from `useInternationalization` composable for building URLs.
The main task of this composable is to add a prefix to URL if needed.

```vue
<script setup lang="ts">
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <NuxtLink :to="formatLink('/account')"> Account</NuxtLink>
</template>
```

## Testing

If you want to test languages locally, and your local domain differs from what is declared on the backend, you can use environment variables.

```
NUXT_PUBLIC_SHOPWARE_DEV_STOREFRONT_URL=http://127.0.0.1:3000
```
