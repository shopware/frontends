# shopware/frontends - helpers

Welcome to `@shopware/helpers` package.

For getting started documentation visit [https://frontends.shopware.com/](https://frontends.shopware.com/)

Documentation specific for this package: [helpers](https://frontends.shopware.com/packages/helpers.html)

## Reusable classes

The `helpersCssClasses` variable, defined in the `cms/layoutClasses.ts` helper file, comprises an array of class names utilized within the CMS.

To enhance type support, a union type `HelpersCssClasses` is defined, which encompasses all class names present in the `helpersCssClasses` array.

```ts
const visibilityMap: Record<CmsVisibility, HelpersCssClasses> = {
  mobile: "max-md:hidden",
  tablet: "md:max-lg:hidden",
  desktop: "lg:hidden",
};
```

These classes can be integrated into a custom template, thereby ensuring consistency across different packages. For example as a `safelist` classes in unocss configuration file

```ts
import { helpersCssClasses } from "@shopware/helpers";

export default defineConfig({
  safelist: helpersCssClasses,
});
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/helpers/CHANGELOG.md)

### Latest changes: 1.6.0

### Minor Changes

- [#1985](https://github.com/shopware/frontends/pull/1985) [`2cbda25`](https://github.com/shopware/frontends/commit/2cbda257a1056454e12f2fba9052f83eecb6d986) Thanks [@mkucmus](https://github.com/mkucmus)! - Added methods to extract product info:
  - `isProductOnSale`
  - `isProductTopSeller`
  - `getProductManufacturerName`

- [#2176](https://github.com/shopware/frontends/pull/2176) [`c647baf`](https://github.com/shopware/frontends/commit/c647baf93e7174b849f5961ee5803add99d78602) Thanks [@mkucmus](https://github.com/mkucmus)! - - Add `getProductListingFromCmsPage` helper to extract product listing from CMS page structure
  - Enable early access to listing data during SSR before component tree renders

### Patch Changes

- [#2030](https://github.com/shopware/frontends/pull/2030) [`22ff62e`](https://github.com/shopware/frontends/commit/22ff62e354f024599d64ea8096af57695248851c) Thanks [@mkucmus](https://github.com/mkucmus)! - Extended `ListingFilter` type to support property options and manufacturer entities:
  - Added optional `options` property for property group options
  - Added optional `entities` property for manufacturer entities
  - Improved type safety by explicitly typing empty array return in `getListingFilters()`

- [#2153](https://github.com/shopware/frontends/pull/2153) [`56cd178`](https://github.com/shopware/frontends/commit/56cd178e25fe2399b7170ccac3044e980621f041) Thanks [@mkucmus](https://github.com/mkucmus)! - Fix `getSrcSetForMedia` to properly encode special characters (spaces, commas, parentheses) in media URLs

- [#2162](https://github.com/shopware/frontends/pull/2162) [`e1fae3e`](https://github.com/shopware/frontends/commit/e1fae3eb6430e5c8e133456fbaf7f215f80c36f6) Thanks [@mkucmus](https://github.com/mkucmus)! - Export encodeUrlPath helper function to properly handle special characters (spaces, commas) in image URLs
