---
"@shopware/composables": minor
---

Add CMS types for the `category-heading`, `video` and `app-renderer` blocks and the `category-name` and `video` elements

New types: `CmsBlockCategoryHeading`, `CmsBlockVideo`, `CmsBlockAppRenderer`, `CmsElementCategoryName`, `CmsElementVideo` and `VideoDisplayMode`.

`CmsElementVideo` describes the `cms_video` data of the element, including the `videoCoverMedia` extension that carries the cover image set for the video in the media module. `CmsBlockAppRenderer` types the `appBlockName` and `slotLayout.grid` custom fields the Administration stores for a block registered through the Meteor Admin SDK.
