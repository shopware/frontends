# Components

## Directory structure

The components are grouped in specific directories depending on an usage within the project:

```text
├─ components/
|  ├─ global/       /* Frontend* SEO page resolvers (Nuxt global, pathPrefix: false) */
|  ├─ errors/       /* ErrorsMaintainMode, ErrorsRoutingNotFound (Nuxt global) */
|  ├─ cms/          /* CMS block/element overrides (Nuxt global for resolveComponent) */
|  ├─ layout/       /* header, footer, account menu etc. */
|  ├─ checkout/     /* cart items, cart overview */
|  ├─ account/      /* order history, account settings */
|  ├─ shared/       /* modals, ... */
|  ├─ ...
```

`global/`, `errors/`, and `cms/` are separate component dirs with `global: true` in `nuxt.config.ts`. Everything else under `components/` is auto-imported only. Do not try to scope globals with `pattern`/`ignore` on the same path twice — Nuxt skips the second scan.

## Component name

Every component has a name, prefixed by the area (directory name) where it's used, for instance: `AccountMenu.vue` located in `./components/account/` directory.

## Using components

According to the Nuxt's [documentation](https://v3.nuxtjs.org/guide/directory-structure/components/#component-names) the components are auto-loaded and available under its names:

`./components/account/AccountMenu.vue` is available in entire project under `AccountMenu` name, so it's not necessary to import them manually:

```jsx
<template>
  <AccountMenu />
</template>
```
