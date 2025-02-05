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

### Latest changes: 1.4.0

### Minor Changes

- [#1602](https://github.com/shopware/frontends/pull/1602) [`bb7d1cb`](https://github.com/shopware/frontends/commit/bb7d1cbc4204ff1d48f77416f94f550bc235e5ed) Thanks [@patzick](https://github.com/patzick)! - Switch from `@shopware-pwa/helpers-next` to `@shopware/helpers` package.

- [#1602](https://github.com/shopware/frontends/pull/1602) [`bb7d1cb`](https://github.com/shopware/frontends/commit/bb7d1cbc4204ff1d48f77416f94f550bc235e5ed) Thanks [@patzick](https://github.com/patzick)! - Switch from `@shopware-pwa/cms-base` to `@shopware/cms-base-layer` package.
