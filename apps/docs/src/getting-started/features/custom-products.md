---
head:
  - - meta
    - name: og:title
      content: "Integrations: Custom Products - Shopware Frontends"
  - - meta
    - name: og:description
      content: "Example of integration with Custom Products extension"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Integration:%20**Custom%20Products**?fontSize=100px"
---

# Custom Products extension

The example explains how **Custom Products** feature is implemented in `vue-demo-store` template (already done), but also can be used as a guide how to deal with the process in any project.

:::warning Custom Products for Shopware 6 is an extension that is part of the Shopware Rise plan.
[Read more](https://docs.shopware.com/en/shopware-6-en/extensions/customproducts).
:::

## Logic: Composable function

See [the source code](https://github.com/shopware/frontends/blob/main/examples/commercial-customized-products/src/composables/useProductCustomizedProductConfigurator.ts) of `useProductCustomizedProductConfigurator` composable function.

The composable is a main place to keep the logic related to _custom product_ features:

- adds TypeScript types
- stores the state
- extracts the custom product's specific data
- exposes method for adding to cart
- serializes the state to be in a correct format for the request's payload (adding to cart)

### Example of usage:

:::warning
Works only if the `useProduct` is fulfilled and the product data is known. Typically on Product Details Page, when the product context is provided.

Visit the [useProduct](../../packages/composables/useProduct) reference to see more details.
:::

```ts
// useProductCustomizedProductConfigurator is autoimported
// in vue-demo-store template as it's located in ~/composables
const {
  isActive, // indicates whether product is empowered by Custom Products extension and active
  customizedProduct, // returns the custom product's template data
  state, // state to be used in option selector / forms
  addToCart, // triggers add to cart action (refreshCart() action invoked afterwards)
  handleFileUpload, // uploads an image, then gets mediaId from API and assigns it to the state
} = useProductCustomizedProductConfigurator();
```

## Presentation: Vue component

See [the source code](https://github.com/shopware/frontends/blob/main/examples/commercial-customized-products/src/components/ProductCustomizedProductConfigurator.vue) of the `ProductCustomizedProductConfigurator` Vue component.

The component is responsible for:

- Displaying product options in any type: text field, image upload, select, color select, image select (this one has to be fixed in the core to get the URL's of the images)
- Showing corresponding additional price and currency of an option

## Implementation

Add the mentioned component in a template. For instance in `<ProductStatic/>` for templates that not come from CMS:

```html{9}
<!-- part of templates/vue-demo-store/components/product/ProductStatic.vue -->
<!-- Options -->
<div class="mt-4 lg:mt-0 lg:row-span-3">
  <h2 class="sr-only">Product information</h2>
  <div class="product-variants mt-10">
    <ProductPrice :product="product" />
    <ProductUnits :product="product" class="text-sm" />
    <ProductVariantConfigurator @change="handleVariantChange" />
    <ProductCustomizedProductConfigurator /> <!-- ADDED -->
    <ProductAddToCart :product="product" />
  </div>
</div>
```

Overwrite a logic in `<ProductAddToCart/>` (or any other responsible for adding a product to cart in your template):

```ts{3-6,9-10}
// part of templates/vue-demo-store/components/product/ProductAddToCart.vue;
// the <script setup lang="ts"> section
const {
  addToCart: customizedProductAddToCart,
  isActive: isCustomizedProductActive,
} = useProductCustomizedProductConfigurator();

const addToCartProxy = async () => {
  if (isCustomizedProductActive.value) {
    await customizedProductAddToCart();
  } else {
    await addToCart();
  }
...
```

Used composable function allows to use `addToCart()` method and `isActive` computed property. Both are described in "Example of usage" chapter above.

There was a condition added to use a different method to add to cart a product if the product is enhanced by Custom Product template ([how to set it up](https://docs.shopware.com/en/shopware-6-en/extensions/customproducts)):

- if the product has a Custom Product template, then use `customizedProductAddToCart()` method.
- otherwise, don't change the adding to cart behavior and use the default one

## Known issues

- Missing images for "Image select" option type (reported in the extension repository)
- Missing cover image (aka thumbnail) for Custom Product in the Cart (reported in the extension repository)
- Display selected option for Cart Item ([Issue](https://github.com/shopware/frontends/issues/456) reported)
