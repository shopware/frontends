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

## localeId

In more complex scenarios, such as when different prefixes are used on the backend and frontend, the `localeId` attribute can be utilized.

```
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    langDir: "./i18n/src/langs/",
    vueI18n: "./i18n/config",
    locales: [
      {
        code: "en-GB",
        iso: "en-GB",
        file: "en-GB.ts",
      },
      {
        code: "testde",
        iso: "de-DE",
        file: "de-DE.ts",
        localeId: "c19b753b5f2c4bea8ad15e00027802d4",
      },
    ],
  },
```

The `localeId` attribute corresponds to a specific language identifier, which can be located within the Shopware administrative panel. Additional information is available at this link: https://docs.shopware.com/en/shopware-6-en/settings/languages

## Multi domain example

To handle multiple domains for different languages, you can configure your application to recognize and switch between these domains seamlessly. Here's an example of how to set up your configuration:

[Check example](https://github.com/shopware/frontends/tree/main/examples/i18n-multi-domain)

*This example should be run locally because of the multi-domain requirements*

## Switching language locally

**Problem**

After switching the language, the URL returned from the backend is used as the basis for redirection which leads to exiting the localhost context.

```typescript
const onChangeHandler = async (option: Event) => {
  const data = await changeLanguage((option.target as HTMLSelectElement).value);

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
};
```

This can be problematic if you are trying to locally test the language switch flow. Below are some examples of how to resolve this problem:


### Locally host overrides
The idea of this solution is to override the domain locally in the `hosts` file.

Windows: `C:\Windows\System32\drivers\etc`
Linux: `/etc/hosts`
macOS: `/etc/hosts`

```
127.0.0.1       yourDomainFromBackend.com
#IPv6
::1             yourDomainFromBackend.com
```

Thanks to this, you will be able to use your local Frontends app instance with the domain returned by the backend.

### Add dev resolver

You can add own dev resolver to avoid redirection

```typescript
const dev = process.dev;

const onChangeHandler = async (option: Event) => {
  const data = await changeLanguage((option.target as HTMLSelectElement).value);

  // Check dev mode
  if (dev) {
    // Set locale
    locale.value = getLanguageCodeFromId(
      (option.target as HTMLSelectElement).value,
    );
    // Refresh page
    window.location.replace(`${window.location.origin}/${locale.value}`);
    return;
  }
  
  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
};
```

## Troubleshooting in reverse proxy environments

When deploying your application behind a reverse proxy, such as Fastly, Cloudflare, or Vercel, you may encounter issues with language switching. This is primarily due to how these services cache responses and handle headers, which can affect the way languages are served to users.

To face possible issues with language switching, you would need to understand how [@nuxtjs/i18n](https://i18n.nuxtjs.org/) module works:

###  **Language Detection**

The i18n module detects the user's preferred language based on the URL or the `Accept-Language` header.xz
The setting can be disabled by setting `detectBrowserLanguage: false` in the i18n module configuration. Then, the language will be determined solely based on the URL and the configured locales.

### **URL Structure**

The i18n module uses a specific URL structure to differentiate between languages. For example, it might use `/en/` for English and `/de/` for German. There are two strategies for this:

   - `prefix_except_default`: This strategy adds a prefix to the URL for all languages except the default one.
   - `prefix_and_default`: This strategy adds a prefix to the URL for all languages, including the default one.

### Multiple locales for the same domain

If you have multiple locales for the same domain, you can configure them in the i18n module. This allows you to serve different languages from the same domain without needing to switch domains.

### [@nuxtjs/i18n](https://i18n.nuxtjs.org/) module reads `x-forwarded-host` header

The i18n module can read the `x-forwarded-host` header to determine the original host of the request. This is useful when your application is behind a reverse proxy, as it allows the i18n module to correctly identify the requested language based on the original host.

### **Caching Issues**

Caching can cause issues with language switching, especially if the cache is not properly configured to handle different languages. To avoid this, ensure that your reverse proxy is set up to cache responses based on the `Accept-Language` header or the URL structure used by the i18n module.

Also, ensure that proxy caching is purged after the deployment of new language configurations or updates to the i18n module.