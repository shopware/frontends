# shopware/frontends - helpers

Welcome to `@shopware-pwa/helpers-next` package.

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
import { helpersCssClasses } from "@shopware-pwa/helpers-next";

export default defineConfig({
  safelist: helpersCssClasses,
});
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/helpers/CHANGELOG.md)

### Latest changes: 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1056](https://github.com/shopware/frontends/pull/1056) [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04) Thanks [@patzick](https://github.com/patzick)! - Removed deprecations from the package:

  - `getProductThumbnailUrl` is removed. Use `getSmallestThumbnailUrl` instead.
  - internal method `_debounce` is removed.
  - internal method `_parseUrlQuery` is removed.

### Minor Changes

- [#857](https://github.com/shopware/frontends/pull/857) [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add isMaintenanceMode to check if backend is available

- [#508](https://github.com/shopware/frontends/pull/508) [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `accessGranted` property for the getMedia helper

- [#477](https://github.com/shopware/frontends/pull/477) [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove "@shopware-pwa/types" dependency and replace it with generic types

- [#582](https://github.com/shopware/frontends/pull/582) [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Export css classes as a separate file

- [#545](https://github.com/shopware/frontends/pull/545) [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956) Thanks [@itscark](https://github.com/itscark)! - Fix visibility classes

### Patch Changes

- [#524](https://github.com/shopware/frontends/pull/524) [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - added `buildUrlPrefix`, which perviously was internal helper of the `@shopware/cms-base` package
