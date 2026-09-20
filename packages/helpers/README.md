# shopware/frontends - helpers

Welcome to `@shopware/helpers` package.

For getting started documentation visit [https://developer.shopware.com/frontends/](https://developer.shopware.com/frontends/)

Documentation specific for this package: [helpers](https://developer.shopware.com/frontends/packages/helpers.html)

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

## `getBackgroundImageUrl` helper

The `getBackgroundImageUrl` function generates optimized CSS `url()` values for CMS background images. It extracts the raw URL, calculates the appropriate dimensions based on the media metadata, and applies image transformation parameters.

### Usage

```ts
import { getBackgroundImageUrl } from "@shopware/helpers";

const optimizedUrl = getBackgroundImageUrl(
  "url(https://cdn.shopware.store/.../image.jpg)",
  cmsBlockOrSection, // object with backgroundMedia.metaData.width/height
  { format: "webp", quality: 85 }, // optional
);
// => 'url("https://cdn.shopware.store/.../image.jpg?width=1000&fit=crop,smart&format=webp&quality=85")'
```

### Parameters

| Parameter | Type                                                                       | Description                                            |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| `url`     | `string`                                                                   | CSS `url()` string containing the background image URL |
| `element` | `{ backgroundMedia?: { metaData?: { width?: number; height?: number } } }` | CMS section or block object with media metadata        |
| `options` | `BackgroundImageOptions` (optional)                                        | Format and quality settings                            |

### `BackgroundImageOptions`

```ts
type BackgroundImageOptions = {
  format?: string; // "webp" | "avif" | "jpg" | "png"
  quality?: number; // 0-100
};
```

When `format` or `quality` are provided, they are appended as query parameters to the image URL. If omitted, only the dimension and fit parameters are applied.

## `generateCdnSrcSet` helper

Generates an HTML `srcset` string using CDN width-based resizing. Useful as a fallback when media has no pre-generated thumbnails — the CDN handles on-the-fly resizing via query parameters.

### Usage

```ts
import { generateCdnSrcSet } from "@shopware/helpers";

const srcset = generateCdnSrcSet(
  "https://cdn.shopware.store/.../image.jpg",
  [400, 800, 1200, 1600], // optional, these are the defaults
  { format: "webp", quality: 85 }, // optional
);
// => "https://cdn.shopware.store/.../image.jpg?width=400&fit=crop,smart&format=webp&quality=85 400w, ...800w, ...1200w, ...1600w"
```

### Parameters

| Parameter | Type                                               | Description                                                     |
| --------- | -------------------------------------------------- | --------------------------------------------------------------- |
| `src`     | `string \| undefined`                              | Base image URL                                                  |
| `widths`  | `number[]` (optional)                              | Array of widths to generate (default: `[400, 800, 1200, 1600]`) |
| `options` | `{ format?: string; quality?: number }` (optional) | Format and quality settings                                     |

Returns `undefined` if `src` is falsy or URL parsing fails.

## `buildCdnImageUrl` helper

Builds an optimized CDN image URL with size parameters based on rendered element dimensions. Adds `width` or `height` (whichever is larger) rounded up to the nearest 100px, plus `fit=crop,smart`.

### Usage

```ts
import { buildCdnImageUrl } from "@shopware/helpers";

const url = buildCdnImageUrl("https://cdn.shopware.store/.../image.jpg", {
  width: 724,
  height: 760,
});
// => "https://cdn.shopware.store/.../image.jpg?height=800&fit=crop,smart"
```

### Parameters

| Parameter    | Type                                               | Description                           |
| ------------ | -------------------------------------------------- | ------------------------------------- |
| `src`        | `string \| undefined`                              | Base image URL                        |
| `dimensions` | `{ width: number; height: number }`                | Rendered element dimensions in pixels |
| `options`    | `{ format?: string; quality?: number }` (optional) | Format and quality settings           |

Returns an empty string if `src` is falsy. Returns the original `src` if URL parsing fails.

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/helpers/CHANGELOG.md)

### Latest changes: 1.8.0

### Minor Changes

- [#2574](https://github.com/shopware/frontends/pull/2574) [`2ddf156`](https://github.com/shopware/frontends/commit/2ddf156805b2941fe2069e78453fb3c4eb6d44ac) Thanks [@mkucmus](https://github.com/mkucmus)! - Add `getCategoryFilterAggregations()` and `getCategoryFilterPostFilter()` to request category aggregations for product listings and filter by category without reducing the aggregations. `excludeRootCategory()` drops the sales channel entry point from the category entities, and the `CATEGORY_AGGREGATION_NAME` / `CATEGORY_COUNTS_AGGREGATION_NAME` / `CATEGORY_PARENTS_AGGREGATION_NAME` constants are exported for consumers that build the aggregations themselves.

  `getListingFilters` (`@beta`) merges the `categories` and `categories-counts` response aggregations into a single `categories` filter with a product count per category. This changes the shape of that filter for listings that already requested a `categories` aggregation: the entities are sorted by count (highest first) instead of keeping the response order, each entity gains a `count`, the filter no longer carries the aggregation's `apiAlias`, and `categories-counts` is no longer returned as a filter of its own.

### Patch Changes

- [#2598](https://github.com/shopware/frontends/pull/2598) [`204c8f4`](https://github.com/shopware/frontends/commit/204c8f45f737e724db6d00b80c5faef8ddb77cb4) Thanks [@dependabot](https://github.com/apps/dependabot)! - Fix Nuxt plugin injection typing for Nuxt 4.5 and maintenance mode error handling.
