---
"@shopware/cms-base-layer": minor
---

Render the CMS blocks and elements Shopware added since 6.6, which rendered nothing until now:

- `category-heading` block and `category-name` element (6.7.12), used by the default listing layouts for the category headline.
- `video` block and element (6.7.8) for media library videos, with every option of the Administration. New translation keys: `cms.video.playLabel`, `cms.video.pauseLabel`, `cms.video.loadError` and `cms.video.notSupported`.
- `app-renderer` block (6.6.1) for blocks registered through the Meteor Admin SDK. A global `CmsBlockAppRenderer{AppBlockName}` component overrides a single app block, see "App blocks" in the README.
