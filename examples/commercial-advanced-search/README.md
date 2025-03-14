# Example of Commercial Advanced Search

The example shows how to use the Advanced Search which is a part of the Commercial plugin.

_To see the example in action it's better to run it within [vue-demo-store](https://github.com/shopware/frontends/tree/main/templates/vue-demo-store) template._

## Features

The example provides also a nuxt layer to show how to use the Advanced Search in any Nuxt project. Nevertheless, every part of it can be copied manually to make any customization easier. 

The utilities provided by the example are:

- 🚠 &nbsp;`LayoutStoreSearch.vue` component responsible for displaying a search bar
- 🛤️ &nbsp;`useProductSearchSuggest` composable function to work with the logic enabled by a plugin (used in the component mentioned above)
- 🔌 &nbsp;`search.ts` middleware to intercept the search route in order to redirect for a predefined search action (see extension's docs).

## Requirements

- A knowledge about [Advanced Search](https://docs.shopware.com/en/shopware-6-en/extensions/advanced-search?category=shopware-6-en/extensions) extension
- Advanced Search extension available
- Some Nuxt.js project

## Setup

1. [Setup](https://frontends.shopware.com/getting-started/templates.html) your Vue template

2. Configure Advanced Search by following the [documentation](https://docs.shopware.com/en/shopware-6-en/extensions/advanced-search#configuration)

## Usage

Ass the nuxt layer isn't published as a package, you can copy the entire `layers/commercial-advanced-search/` into your project or the `components`, `composables` and `middleware` folders to your project. 

In case of using a **layer way** - you need to register it by adding to you `nuxt.config.ts` _extends_ config:

```ts
extends: [
	"./layers/commercial-advanced-search", // this one!
   //...
	"@shopware-pwa/cms-base",
   "@shopware-pwa/composables-next/nuxt-layer",
],
```

Then, regardless the way you registered the files you can use the `LayoutStoreSearch.vue` component in your layout / component:

```vue
<template>
   <LayoutStoreSearch />
</template>
```

😊 If the feature was registered in a project based on [vue-demo-store](https://github.com/shopware/frontends/tree/main/templates/vue-demo-store) as a nuxt layer, then the default top search bar will be replaced by a component of the layer without doing any additional work.


### `useProductSearchSuggest` API

Available methods and properties provided by the composable function:

- `searchTerm` - reactive property with the current search term
- `loading` - reactive property with the loading state
- `search` - method to search for products by the provided term
- `getProducts` - computed property with the list of found products
- `getCategories` - computed property with the list of found categories
- `getManufacturers` - computed property with the list of found manufacturers
- `getSuggestions` - computed property with the list of found suggestions (terms that can be used for search in case of being preconfigured)
- `getTotal` - computed property with the total number of found products

Investigate more in the [component's source](https://github.com/shopware/frontends/blob/main/examples/commercial-advanced-search/layers/commercial-advanced-search/components/layout/LayoutStoreSearch.vue).

### `search.ts` middleware

The purpose of the middleware in that case is to redirect an user in case of visiting the `/search` route with predefined search terms (actions, exaplained in the mentioned docs).

Interception covers the following cases:

- if action is in `external URL` type, then the user will be redirected to the provided URL
- if action is in `category` type, then the user will be redirected to the category page
- if action is in `product` type, then the user will be redirected to the product page

## Run for development

```sh
pnpm dev
```

or...

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/examples/commercial-advanced-search/layers/commercial-advanced-search?file=README.md)

## Resources

- [Advanced Search docs](https://docs.shopware.com/en/shopware-6-en/extensions/advanced-search) docs
- [📖 &nbsp;Composable Frontends Documentation](https://frontends.shopware.com)
