# shopware/frontends - helpers

> [!WARNING]
>
> This package is deprecated and will be removed in the future. Use [@shopware/helpers](https://www.npmjs.com/package/@shopware/helpers) instead.

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

### Latest changes: 1.3.0

### Minor Changes

- [#1599](https://github.com/shopware/frontends/pull/1599) [`6736509`](https://github.com/shopware/frontends/commit/67365096168e28b9683cfd3b5d4c8bb3b4ae07e3) Thanks [@patzick](https://github.com/patzick)! - Package `@shopware-pwa/helpers-next` is deprecated. Use [@shopware/helpers](https://www.npmjs.com/package/@shopware/helpers) instead.
