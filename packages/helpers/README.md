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

### Latest changes: 1.0.2

### Patch Changes

- [#1191](https://github.com/shopware/frontends/pull/1191) [`2e4c887`](https://github.com/shopware/frontends/commit/2e4c8872060fb2ebabe5b89d92761994a2ed8128) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent from getting an incorrect srcset format when img url is not set.

  before when there were no urls for 400w and 800w:
  `src="image1.jpg 100w, 400w, 800w"`

  now only the entry with an URL defined is returned
