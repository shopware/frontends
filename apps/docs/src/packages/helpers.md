

<!-- API -->
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


<!--  -->


## API



### `buildCdnImageUrl`

Builds an optimized CDN image URL with size parameters.
Adds width or height (whichever is larger, width if equal)
rounded up to the nearest 100px.
```ts
export function buildCdnImageUrl(
  src: string | undefined,
  dimensions: { width: number; height: number },
  options?: { format?: string; quality?: number },
): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getSrcSetForMedia.ts#L74" target="_blank">source code</a>


### `buildUrlPrefix`


```ts
export function buildUrlPrefix(
  url: string | UrlRoute,
  prefix: string,
): UrlRouteOutput 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/buildUrlPrefix.ts#L13" target="_blank">source code</a>


<details>
<summary> <span style="color:#9f6c0f;font-size:0.8em;cursor:pointer;">expand UrlRouteOutput</span> </summary>
  
```ts
export type UrlRouteOutput = Omit<UrlRoute, "path"> & { path: string };
```

</details>



### `canUseQuoteActions`


```ts
export function canUseQuoteActions<
  T extends {
    stateMachineState?: {
      technicalName: string;
    };
  },
>(quote: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/b2bQuoteManagement/canUseQuoteActions.ts#L1" target="_blank">source code</a>


### `downloadFile`

Download file
```ts
export function downloadFile<T>(file: T, name: string) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/downloadFile.ts#L5" target="_blank">source code</a>


### `encodeUrlPath`

Encodes URL pathname to handle special characters (spaces, commas, etc.)
```ts
export function encodeUrlPath(urlString: string): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getSrcSetForMedia.ts#L10" target="_blank">source code</a>


### `excludeRootCategory`

Category filter entities without the sales channel entry point.

That root category is an ancestor of every product's category tree, so it
matches the whole result set and filtering by it changes nothing. Opt in per
listing by passing `sessionContext.salesChannel.navigationCategoryId`;
without an id the entities are returned unchanged.
```ts
export function excludeRootCategory<T extends { id: string }>(
  entities: T[] | undefined | null,
  rootCategoryId: string | undefined | null,
): T[] 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/listing/categoryFilter.ts#L62" target="_blank">source code</a>


### `generateCdnSrcSet`

Generates a srcset string using CDN width-based resizing.
Useful as a fallback when media has no pre-generated thumbnails.
```ts
export function generateCdnSrcSet(
  src: string | undefined,
  widths: number[] = [400, 800, 1200, 1600],
  options?: { format?: string; quality?: number },
): string | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getSrcSetForMedia.ts#L35" target="_blank">source code</a>


### `getBackgroundImageUrl`


```ts
export function getBackgroundImageUrl<
  T extends {
    backgroundMedia?: {
      metaData?: {
        width?: number;
        height?: number;
      };
    };
  },
>(url: string, element: T, options?: BackgroundImageOptions): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/getBackgroundImageUrl.ts#L21" target="_blank">source code</a>


### `getBiggestThumbnailUrl`

Returns the biggest thumbnail url from the media object
```ts
export function getBiggestThumbnailUrl<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  },
>(media?: T): string | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getBiggestThumbnailUrl.ts#L9" target="_blank">source code</a>


### `getCanonicalPathForTechnicalPath`

Get the canonical path for a mapped technical Shopware URL.

Returns `null` for SEO URLs, synthetic technical fallbacks without an SEO
mapping, and invalid mappings that would redirect to another technical URL.
```ts
export function getCanonicalPathForTechnicalPath(
  path: string,
  seoUrl?: object | null,
): string | null 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getRouteFromPathInfo.ts#L67" target="_blank">source code</a>


### `getCategoryBreadcrumbs`

Gather breadcrumbs from category
```ts
export function getCategoryBreadcrumbs<
  T extends {
    translated?: {
      breadcrumb?: string[];
    };
    breadcrumb?: string[];
  },
>(
  category: T,
  options?: {
    /**
     * Start at specific index if your navigation
     * contains root names which should not be visible.
     */
    startIndex?: number;
  },
) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/category/getCategoryBreadcrumbs.ts#L5" target="_blank">source code</a>


### `getCategoryFilterAggregations`

Category aggregations for a listing filter: an entity `categories` agg plus a
flat `categories-counts` terms agg. Kept flat because the ES search route
returns no buckets once a nested sub-agg is attached, so variants overcount.
```ts
export function getCategoryFilterAggregations(): Array<
  CategoryEntityAggregation | CategoryCountsAggregation
> 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/listing/categoryFilter.ts#L34" target="_blank">source code</a>


### `getCategoryFilterPostFilter`

Criteria `post-filter` entry narrowing a product listing to the given
category ids. Sent as a post-filter, it does not reduce the category
aggregations from `getCategoryFilterAggregations`, so all category options
stay visible while results are filtered (standard faceted behavior).
```ts
export function getCategoryFilterPostFilter(categoryIds: string[]): {
  field: string;
  type: "equalsAny";
  value: string;
} 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/listing/categoryFilter.ts#L78" target="_blank">source code</a>


### `getCategoryImageUrl`

gets the cover image
```ts
export function getCategoryImageUrl<
  T extends {
    media?: { url: string };
    type: string;
  },
>(category: T): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/category/getCategoryImageUrl.ts#L16" target="_blank">source code</a>


### `getCategoryRoute`

Get category/navigation route information for Vue Router.

Returns category or navigation URL and route informations for resolving SEO url.
Use it with combination of `<RouterLink>` or `<NuxtLink>` in Vue.js or Nuxt.js projects.

Example:
```html
<RouterLink :to="getCategoryRoute(navigationElement)">
```
```ts
export function getCategoryRoute<
  T extends {
    type: string;
    externalLink?: string;
    seoUrls?: { seoPathInfo: string }[];
    internalLink?: string;
    id: string;
    linkType?: string;
  },
>(category: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/category/getCategoryRoute.ts#L17" target="_blank">source code</a>


### `getCategoryUrl`

Get URL for category.
Some link {@link isLinkCategory}
```ts
export function getCategoryUrl<
  T extends {
    type: string;
    externalLink?: string;
    seoUrls?: { seoPathInfo: string }[];
    internalLink?: string;
    id: string;
    linkType?: string;
  },
>(category: T): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/category/getCategoryUrl.ts#L29" target="_blank">source code</a>


### `getCmsBreadcrumbs`

Build the breadcrumbs for the CMS page
```ts
export function getCmsBreadcrumbs<
  T extends {
    translated: {
      name: string;
    };
  },
>(page: T): { name: string }[] 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/getCmsBreadcrumbs.ts#L7" target="_blank">source code</a>


### `getCmsEntityObject`

Returns the main page object depending of the type of the CMS page.
```ts
export function getCmsEntityObject(
  response: CmsPageResponse,
): Product | Category | LandingPage 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/index.ts#L37" target="_blank">source code</a>


### `getCmsLayoutConfiguration`

Get layout configuration for CMS content
```ts
export function getCmsLayoutConfiguration<
  T extends CmsBlock | CmsSection | CmsSlot,
>(content: T): LayoutConfiguration 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/getCmsLayoutConfiguration.ts#L87" target="_blank">source code</a>


<details>
<summary> <span style="color:#9f6c0f;font-size:0.8em;cursor:pointer;">expand LayoutConfiguration</span> </summary>
  
```ts
export type LayoutConfiguration = {
  layoutStyles: {
    backgroundColor?: string | null;
    backgroundImage?: string | null;
    backgroundSize?: string | null;
    sizingMode?: string | null;
    marginBottom?: string | null | undefined;
    marginLeft?: string | null | undefined;
    marginRight?: string | null | undefined;
    marginTop?: string | null | undefined;
  };
  cssClasses: {
    [cssClass: string]: boolean;
  } | null;
};
```

</details>



### `getCmsTranslate`

Replace text placeholder with param value
```ts
export function getCmsTranslate(
  key: string,
  params?: { [key: string]: string | number | null | undefined } | null,
) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/getCmsTranslate.ts#L8" target="_blank">source code</a>


### `getFormattedPrice`

Get formatted price
```ts
export function getFormattedPrice(
  value: string | number,
  currency: string,
  options: Options = {
    direction: "ltr",
    removeDecimals: false,
    removeCurrency: false,
  },
): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/price/getFormattedPrice.ts#L27" target="_blank">source code</a>


### `getFrontendRouteName`


```ts
export function getFrontendRouteName(
  routeName: string | undefined,
): string | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getFrontendRouteName.ts#L25" target="_blank">source code</a>


### `getLanguageName`

Get translated language name
```ts
export function getLanguageName<
  T extends {
    translationCode?: { translated: { name: string } };
  },
>(language: T): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/languages/getLanguageName.ts#L7" target="_blank">source code</a>


### `getListingFilters`

TODO: Listing filters need better schema-backed types.
```ts
export function getListingFilters<T extends Record<string, any>>(
  aggregations: T | undefined | null,
): ListingFilter[] 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/listing/filters.ts#L98" target="_blank">source code</a>


### `getMainImageUrl`

gets the cover image
```ts
export function getMainImageUrl<
  T extends
    | {
        cover: {
          media?: {
            url: string;
          };
        };
      }
    | {
        media?: Array<{
          media?: {
            url?: string;
          };
        }>;
      }
    | {
        cover: {
          url: string;
        };
      }
    | {
        cover: null;
      },
>(object: T): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getMainImageUrl.ts#L10" target="_blank">source code</a>


### `getMedia`

Prepare media object
```ts
export function getMedia<
  T extends {
    downloads?: Array<{
      id: string;
      accessGranted: boolean;
      media: {
        fileName: string;
        fileExtension: string;
      };
    }>;
  },
>(lineItem: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getMedia.ts#L15" target="_blank">source code</a>


### `getPaymentMethodIcon`

Get payment method icon
```ts
export function getPaymentMethodIcon<
  T extends {
    media?: {
      url: string;
    };
  },
>(paymentMethod: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/checkout/getPaymentMethodIcon.ts#L4" target="_blank">source code</a>


### `getProductCalculatedListingPrice`

Get the calculated list price
```ts
export function getProductCalculatedListingPrice<
  T extends {
    calculatedPrice?: CalculatedPrice;
    calculatedPrices?: CalculatedPrice[];
  },
>(product?: T): number | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductCalculatedListingPrice.ts#L16" target="_blank">source code</a>


### `getProductFreeShipping`

Get product free shipping property
```ts
export function getProductFreeShipping<
  T extends {
    shippingFree: boolean;
  },
>(product?: T): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductFreeShipping.ts#L11" target="_blank">source code</a>


### `getProductFromPrice`


```ts
export function getProductFromPrice<
  T extends {
    calculatedPrice?: CalculatedPrice;
    calculatedPrices?: CalculatedPrice[];
  },
>(product: T): number | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductFromPrice.ts#L12" target="_blank">source code</a>


### `getProductListingFromCmsPage`

Extracts the product listing data from a CMS page structure.
Useful for SSR to get listing data early before components render.
```ts
export function getProductListingFromCmsPage<T = unknown>(
  cmsPage: CmsPageStructure,
): T | null 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/getProductListingFromCmsPage.ts#L29" target="_blank">source code</a>


### `getProductManufacturerName`

Gets the translated name of the product manufacturer
```ts
export function getProductManufacturerName(
  product: ProductWithManufacturer,
): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductManufacturerName.ts#L12" target="_blank">source code</a>


### `getProductName`


```ts
export function getProductName<
  T extends {
    name: string;
  },
>({ product }: { product?: T } = {}): string | null 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductName.ts#L10" target="_blank">source code</a>


### `getProductRatingAverage`

Get product rating average property
```ts
export function getProductRatingAverage<T extends { ratingAverage: number }>(
  product: T,
): number | null 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductRatingAverage.ts#L12" target="_blank">source code</a>


### `getProductReviews`

Format product reviews to ui-interfaces
```ts
export function getProductReviews<
  T extends {
    id: string;
    productReviews?: Array<{
      id: string;
      externalUser?: string;
      customerId?: string;
      createdAt: string;
      content: string;
      points?: number;
    }>;
  },
>({ product }: { product?: T } = {}): UiProductReview[] 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductReviews.ts#L12" target="_blank">source code</a>


### `getProductRoute`

Get product route information for Vue router.

Returns product URL and route informations for resolving SEO url.
Use it with combination of `<RouterLink>` or `<NuxtLink>` in Vue.js or Nuxt.js projects.
```ts
export function getProductRoute<
  T extends {
    id: string;
    seoUrls?: Array<{
      seoPathInfo?: string;
    }>;
  },
>(product?: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductRoute.ts#L13" target="_blank">source code</a>


### `getProductTierPrices`

Get the prices depending on quantity added to cart.
Tier prices can be set in `Advanced pricing` tab in `Product view` (admin panel)
```ts
export function getProductTierPrices<
  T extends {
    calculatedPrices?: Array<{
      unitPrice: number;
      quantity: number;
    }>;
  },
>(product?: T): TierPrice[] 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductTierPrices.ts#L19" target="_blank">source code</a>


### `getProductUrl`

Get product url. The priority is SEO url and then technical url.
```ts
export function getProductUrl<
  T extends {
    id: string;
    seoUrls?: Array<{
      seoPathInfo?: string;
    }>;
  },
>(product?: T): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/getProductUrl.ts#L10" target="_blank">source code</a>


### `getRouteFromPathInfo`


```ts
export function getRouteFromPathInfo(
  path: string,
): RouteInfoFromPathInfo | null 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getRouteFromPathInfo.ts#L41" target="_blank">source code</a>


### `getShippingMethodDeliveryTime`

Get shipping delivery time
```ts
export function getShippingMethodDeliveryTime<
  T extends {
    deliveryTime?: {
      translated: {
        name: string;
      };
    };
  },
>(shippingMethod: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/checkout/getShippingMethodDeliveryTime.ts#L5" target="_blank">source code</a>


### `getShippingMethodIcon`

Get shipping method icon
```ts
export function getShippingMethodIcon<
  T extends {
    media?: {
      url: string;
    };
  },
>(shippingMethod: T) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/checkout/getShippingMethodIcon.ts#L4" target="_blank">source code</a>


### `getSmallestThumbnailUrl`

Returns the smallest thumbnail url from the media object or the media.url if no thumbnails are available
```ts
export function getSmallestThumbnailUrl<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
    url?: string;
  },
>(media?: T): string | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getSmallestThumbnailUrl.ts#L9" target="_blank">source code</a>


### `getSrcSetForMedia`

Returns the srcset attribute for the image, for available breakpoints
```ts
export function getSrcSetForMedia<
  T extends {
    thumbnails?: Array<{
      width: number;
      url: string;
    }>;
  },
>(media?: T): string | undefined 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/media/getSrcSetForMedia.ts#L119" target="_blank">source code</a>


### `getTranslatedProperty`

Get translated property from the given object.
```ts
export function getTranslatedProperty<T>(
  element: T | undefined | null | never,
  property: keyof T,
): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getTranslatedProperty.ts#L8" target="_blank">source code</a>


### `isCategory`


```ts
export function isCategory<T extends { apiAlias: string }>(
  entity: T | Category,
): entity is Category 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/index.ts#L61" target="_blank">source code</a>


### `isLandingPage`


```ts
export function isLandingPage<T extends { apiAlias: string }>(
  entity: T | LandingPage,
): entity is LandingPage 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/index.ts#L67" target="_blank">source code</a>


### `isMaintenanceMode`


```ts
export function isMaintenanceMode<
  T extends {
    code?: string;
  },
>(errors: T[]): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/cms/isMaintenanceMode.ts#L1" target="_blank">source code</a>


### `isProductOnSale`

Checks if a product is on sale based on its price percentage
```ts
export function isProductOnSale(product: {
  calculatedPrice: {
    listPrice?: {
      percentage?: number;
    } | null;
  };
}): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/isProductOnSale.ts#L4" target="_blank">source code</a>


### `isProductTopSeller`

Checks if a product is marked as a top seller
```ts
export function isProductTopSeller(product: {
  markAsTopseller?: boolean;
}): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/product/isProductTopSeller.ts#L4" target="_blank">source code</a>


### `isTechnicalPath`


```ts
export function isTechnicalPath(path: string): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getRouteFromPathInfo.ts#L19" target="_blank">source code</a>


### `isTechnicalUrl`

Check whether an absolute or relative URL points to a technical Shopware
route. Query parameters and fragments are ignored.
```ts
export function isTechnicalUrl(
  url: string,
  baseUrl = "http://localhost",
): boolean 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getRouteFromPathInfo.ts#L30" target="_blank">source code</a>


### `normalizePath`


```ts
export function normalizePath(path: string): string 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/getRouteFromPathInfo.ts#L15" target="_blank">source code</a>


### `relativeUrlSlash`

Add/remove slash from the relative path
```ts
export function relativeUrlSlash(relativeUrl: string, slash = true) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/relativeUrlSlash.ts#L7" target="_blank">source code</a>


### `urlIsAbsolute`


```ts
export function urlIsAbsolute(url: string) 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/helpers/src/urlIsAbsolute.ts#L1" target="_blank">source code</a>

<div data-placeholder="dynamic-markdown"></div>
