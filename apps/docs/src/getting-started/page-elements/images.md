---
head:
  - - meta
    - name: og:title
      content: "Working with Images"
  - - meta
    - name: og:description
      content: "How to display images served by API"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Working%20with%20**Images**.png?fontSize=110px"
nav:
  position: 30
---

<script setup>
import StackBlitzLiveExample from "../../components/StackBlitzLiveExample.vue";
</script>

# Working with Images

This section covers topics related to images, with a focus on what comes from API.

:::warning Not auto-loaded
Although images are not always contained in API responses, we try to keep the composables logic aware of that and ready to load if they are needed.

Which means if you need to work with images, ensure the requests contains additional [associations](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#associations).

Example of request's payload with media association included, to avoid an empty `media` object within the response:

```json
{
  "associations": {
    "media": {}
  }
}
```

:::

## Structure of media objects

Media objects can be used in many places, such as:

- CMS objects (containing [CmsElementImage](https://github.com/shopware/frontends/blob/main/packages/composables/src/types/cmsElementTypes.ts#L71) element)
- Product (cover image, image gallery, attributes in type media, etc.)
- Category (main image, ...)
- ...

Regardless the outer container (see [ProductMedia](https://github.com/shopware/frontends/blob/main/packages/types/shopware-6-client/models/content/product/ProductMedia.d.ts#L8) as example) an image object can be wrapped with, the inner structure is reflected in type definition at [Media](https://github.com/shopware/frontends/blob/main/packages/types/shopware-6-client/models/content/media/Media.d.ts#L23)

Let's have a look what's inside:

```json
{
  // irrelevant data omitted
  ...
  "mimeType": "image/webp", // mime-type of media object, supported by the Shopware 6 platform
  "fileExtension": "webp",
  "fileSize": 492024,
  "title": "Frontends Logo",
  "metaData": {
      "hash": "b795091b0a92b8a0605281f710dc1c28",
      "type": 2,
      "width": 3505, // original width
      "height": 5258 // original height
  },
  "alt": "Shopware Frontends",
  "url": "http://localhost/media/shopware-frontends-4P8HWu_NRp4-unsplash.jpg",
  "fileName": "shopware-frontends-4P8HWu_NRp4-unsplash",
  "thumbnails": [ // list of resized images for previously configured ranges
    {
      "width": 1920,
      "height": 1920,
      "url": "http://localhost/thumbnail/ainars-cekuls-4P8HWu_NRp4-unsplash_1920x1920.webp",
    },
    {
      // omitted irrelevant data
      "width": 800,
      "height": 800,
      "url": "http://localhost/thumbnail/ainars-cekuls-4P8HWu_NRp4-unsplash_800x800.webp",
      "apiAlias": "media_thumbnail"
    },
    ...
  ]
  ...
}
```

The media object, and its `thumbnails` list, contain all required information about the file to be used in the browser like URL and sizes.

## Thumbnails and resolutions

By default, every uploaded image is resized to the predefined width and height sizes (in pixels):

- 1920x1920
- 800x800
- 400x400

In order to change those sizes, or add another one (also the quality, or to keep aspect ratio), the values need to be adjusted in administration panel, for specific media folder.

![Edit media sizes](../../.assets/edit-media-sizes.png)

:::warning Image processing
While a file is uploaded, it's been automatically resized for the current configuration in Administration > Media section. Thanks to this, the newly uploaded files will be available for all required dimensions. However keep in mind that if your settings have changes, the new dimensions won't be applied automatically for the old images.
:::

## Helpers

There are few functions that could be used to extract some crucial information about the media in short way. Browse [Helpers > Media](../../packages/helpers.html#Media) category to see them all.

Example how to work with Product's main image:

```ts
import type { Product } from "@shopware-pwa/types";
import { getMainImageUrl } from "@shopware-pwa/helpers-next";

const coverUrl = getMainImageUrl(product as Product);
// coverUrl is now an URL to the resource (or undefined)
```

## Responsive Images

Having additional information about resized images (see `thumbnails` array in `Media` object), we are able to use them to define [srcset](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset) attribute for `<img>`.

```vue{8}
<script>
import type { Product, Media } from "@shopware-pwa/types";
const product: Product = {} // an object omitted
// get the cover media image (main image for a product)
const coverMedia = product.cover?.media as Media
// prepare `srcset` string for available thumbnails
// let the breakpoints be for every width range
const srcset = coverMedia?.thumbnails?.map((thumb) => `${thumb.url} ${thumb.width}w`).join(", ")
</script>

<template>
   <img
    :srcset="srcset"
    :src="coverMedia?.url"
    :alt="coverMedia?.alt"
    :title="coverMedia?.title"
  >
</template>
```

### Live example

Have a look on live example:
<StackBlitzLiveExample projectPath="shopware/frontends/tree/main/examples/responsive-images" openPath="/" />
<br/>

The example above shows how to use dimension sizes configured in admin panel as ranges for viewport. However it can be adjusted to your needs.

The `src` attribute points to the main image URL (not resized) as a fallback.

As long as `thumbnails` array is fulfilled, the same strategy can be applied when we work with every `media` object for each entity available in Shopware 6.

<PageRef page="../../best-practices/images" title="Best Practices" sub="Best Practices to work with images" />
