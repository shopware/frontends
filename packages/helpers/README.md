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

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | CSS `url()` string containing the background image URL |
| `element` | `{ backgroundMedia?: { metaData?: { width?: number; height?: number } } }` | CMS section or block object with media metadata |
| `options` | `BackgroundImageOptions` (optional) | Format and quality settings |

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

| Parameter | Type | Description |
|-----------|------|-------------|
| `src` | `string \| undefined` | Base image URL |
| `widths` | `number[]` (optional) | Array of widths to generate (default: `[400, 800, 1200, 1600]`) |
| `options` | `{ format?: string; quality?: number }` (optional) | Format and quality settings |

Returns `undefined` if `src` is falsy or URL parsing fails.

## `buildCdnImageUrl` helper

Builds an optimized CDN image URL with size parameters based on rendered element dimensions. Adds `width` or `height` (whichever is larger) rounded up to the nearest 100px, plus `fit=crop,smart`.

### Usage

```ts
import { buildCdnImageUrl } from "@shopware/helpers";

const url = buildCdnImageUrl(
  "https://cdn.shopware.store/.../image.jpg",
  { width: 724, height: 760 },
);
// => "https://cdn.shopware.store/.../image.jpg?height=800&fit=crop,smart"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `src` | `string \| undefined` | Base image URL |
| `dimensions` | `{ width: number; height: number }` | Rendered element dimensions in pixels |
| `options` | `{ format?: string; quality?: number }` (optional) | Format and quality settings |

Returns an empty string if `src` is falsy. Returns the original `src` if URL parsing fails.

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
