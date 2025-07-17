# Components

## Directory structure

The components are grouped in specific directories depending on an usage within the project:

```text
├─ components/
|  ├─ layout/       /* header, footer, account menu etc. */
|  ├─ checkout/     /* cart items, cart overview */
|  ├─ account/      /* order history, account settings */
|  ├─ shared/       /* modals, ... */
|  ├─ ...
```

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
