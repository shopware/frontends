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
This is the implementation working with the `vue-starter-template`. To see the details, please go to the `templates/vue-starter-template` directory in the repository.
:::

This page covers the i18n configuration. What happens at runtime — switching the language and the currency, the redirect a language switch ends in, and building locale-aware links with `formatLink` — is covered end-to-end in the [Language and Currency Switch recipe](../frontends-recipes/context/language-and-currency.html) and the [Session Context recipe](../frontends-recipes/context/session-context.html).

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

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/configuration" code no-name -->

```
www.example.com         // GB site
www.example.com/de-DE   // DE site
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/configuration-2" code no-name -->

```
{
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    langDir: "./src/langs/",
    vueI18n: "config.ts",
    locales: [
      {
        code: "en-GB",
        language: "en-GB",
        file: "en-GB.ts",
      },
      {
        code: "de-DE",
        language: "de-DE",
        file: "de-DE.ts",
      },
    ],
  },
}
```

<!-- /automd -->

**_When you are using different domains:_**

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/configuration-3" code no-name -->

```
www.example1.com     // GB site
www.example2.com     // DE site
```

<!-- /automd -->

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/configuration-4" code no-name -->

```
{
  i18n: {
    differentDomains: true,
    langDir: "./src/langs/",
    vueI18n: "config.ts",
    locales: [
      {
        domain: "example1.com",
        code: "en-GB",
        language: "en-GB",
        file: "en-GB.ts",
      },
      {
        domain: "example2.com",
        code: "de-DE",
        language: "de-DE",
        file: "de-DE.ts",
      },
    ],
  },
}
```

<!-- /automd -->

## Testing

To test languages against a local domain that differs from the one declared on the backend, set `devStorefrontUrl`. The [Storefront URL guide](./storefront-url.html#devstorefronturl) explains how to set it and when the environment variable takes effect.

## localeId

In more complex scenarios, such as when different prefixes are used on the backend and frontend, the `localeId` attribute can be utilized.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/localeid" code no-name -->

```
i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    langDir: "./src/langs/",
    vueI18n: "config.ts",
    locales: [
      {
        code: "en-GB",
        language: "en-GB",
        file: "en-GB.ts",
      },
      {
        code: "testde",
        language: "de-DE",
        file: "de-DE.ts",
        localeId: "c19b753b5f2c4bea8ad15e00027802d4",
      },
    ],
  },
```

<!-- /automd -->

The `localeId` attribute corresponds to a specific language identifier, which can be located within the Shopware administrative panel. Additional information is available at this link: https://docs.shopware.com/en/shopware-6-en/settings/languages

## Multi domain example

To handle multiple domains for different languages, you can configure your application to recognize and switch between these domains seamlessly. Here's an example of how to set up your configuration:

[Check example](https://github.com/shopware/frontends/tree/main/examples/i18n-multi-domain)

_This example should be run locally because of the multi-domain requirements_

## Switching language locally

**Problem**

After switching the language, the URL returned from the backend is used as the basis for redirection which leads to exiting the localhost context.

The switch itself, with `changeLanguage` and `replaceToDevStorefront`, is shown in the [Language and Currency Switch recipe](../frontends-recipes/context/language-and-currency.html).

This can be problematic if you are trying to locally test the language switch flow. Below are some examples of how to resolve this problem:

### Locally host overrides

The idea of this solution is to override the domain locally in the `hosts` file.

Windows: `C:\Windows\System32\drivers\etc`
Linux: `/etc/hosts`
macOS: `/etc/hosts`

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/locally-host-overrides" code no-name -->

```
127.0.0.1       yourDomainFromBackend.com
#IPv6
::1             yourDomainFromBackend.com
```

<!-- /automd -->

Thanks to this, you will be able to use your local Frontends app instance with the domain returned by the backend.

### Add dev resolver

You can add own dev resolver to avoid redirection

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/languages/add-dev-resolver.ts" code lang="typescript" no-name -->

```typescript
import { ref, useInternationalization } from "#imports";

const { changeLanguage, getLanguageCodeFromId, replaceToDevStorefront } =
  useInternationalization();
const locale = ref("");
const dev = import.meta.dev;

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

<!-- /automd -->

## Troubleshooting in reverse proxy environments

When deploying your application behind a reverse proxy, such as Fastly, Cloudflare, or Vercel, you may encounter issues with language switching. This is primarily due to how these services cache responses and handle headers, which can affect the way languages are served to users.

To face possible issues with language switching, you would need to understand how [@nuxtjs/i18n](https://i18n.nuxtjs.org/) module works:

### **Language Detection**

The i18n module detects the user's preferred language based on the URL or the `Accept-Language` header.
The setting can be disabled by setting `detectBrowserLanguage: false` in the i18n module configuration. Then, the language will be determined solely based on the URL and the configured locales.

### **URL Structure**

The i18n module uses a specific URL structure to differentiate between languages. For example, it might use `/en/` for English and `/de/` for German. The `strategy` option picks one of four schemes:

- `prefix_except_default`: every language except the default one gets a prefix. This is the default and what `vue-starter-template` uses.
- `prefix`: every language gets a prefix, the default one included.
- `prefix_and_default`: every language gets a prefix, and the default one is also served without it.
- `no_prefix`: no language gets a prefix.

### Multiple locales for the same domain

If you have multiple locales for the same domain, you can configure them in the i18n module. This allows you to serve different languages from the same domain without needing to switch domains.

### [@nuxtjs/i18n](https://i18n.nuxtjs.org/) module reads `x-forwarded-host` header

The i18n module can read the `x-forwarded-host` header to determine the original host of the request. This is useful when your application is behind a reverse proxy, as it allows the i18n module to correctly identify the requested language based on the original host.

### **Caching Issues**

Caching can cause issues with language switching, especially if the cache is not properly configured to handle different languages. To avoid this, ensure that your reverse proxy is set up to cache responses based on the `Accept-Language` header or the URL structure used by the i18n module.

Also, ensure that proxy caching is purged after the deployment of new language configurations or updates to the i18n module.
