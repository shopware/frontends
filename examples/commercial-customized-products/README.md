# Customized Products example

The example shows how to integrate a Vue.js project with the logic provided by Customized Products plugin. This is ready to run project containing all needed tools to make Custom Products extension working in a headless approach.

## Features

- 🚠 &nbsp;`ProductCustomizedProductConfigurator.vue` component to use in a Vue project
- 🛤️ &nbsp;`useProductCustomizedProductConfigurator` composable function to work with the logic enabled by a plugin

## Requirements

- A knowledge about [Custom Products](https://docs.shopware.com/en/shopware-6-en/extensions/customproducts) extension
- Custom Products extension available
- Some Vue.js project

## Setup

1. [Setup](https://frontends.shopware.com/getting-started/templates.html) your Vue template

2. Prepare some customized products following the [documentation](https://docs.shopware.com/en/shopware-6-en/extensions/customproducts#add-template)

## Usage

In the example, the product with Custom Product is found and used in the template.

`<ProductCustomizedProductConfigurator />` component utilizes features from `useProductCustomizedProductConfigurator` which takes the product from app's context and take care of the state of selected options.

1. Import a component to display extended product options

   ```js
   import ProductCustomizedProductConfigurator from "@/components/ProductCustomizedProductConfigurator.vue";
   ```

2. Register a product in Shopware context:

   ```js
   // product found by an api-client or a composable
   useProduct(product);
   ```

3. Display the component

   ```html
   <!-- your Vue template -->
   <ProductCustomizedProductConfigurator />
   ```

### `useProductCustomizedProductConfigurator` API

Available methods and properties provided by the composable function:

`isActive` - is customized product enabled

`customizedProduct` - the entire `Product` entity

`state` - state of the selected options

`addToCart` - method for adding product to cart, using customized options in the payload

`handleFileUpload` - helper for media type options, updates the state automatically

Investigate more in the [component's source](https://github.com/shopware/frontends/blob/main/examples/commercial-customized-products/src/components/ProductCustomizedProductConfigurator.vue).

## Run for development

```sh
pnpm dev
```

or...

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/examples/commercial-customized-products?file=README.md)

## Resources

- [Custom Products](https://docs.shopware.com/en/shopware-6-en/extensions/customproducts) docs
- [📖 &nbsp;Composable Frontends Documentation](https://frontends.shopware.com)
