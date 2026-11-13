---
"@shopware/helpers": minor
"vue-starter-template": minor
---

Resolve the technical URL of a standalone CMS layout, `/page/cms/<id>` (Shopware's `frontend.cms.page.full` route). Layouts that are not assigned to a category or landing page, like the legal pages from the basic information settings, have no SEO URL, and Shopware links them by this path, for example in `llms.txt` served through `/store-api/sales-channel-file/{fileName}`. `getRouteFromPathInfo` and `isTechnicalPath` now recognise the `/page/cms/` prefix, and `vue-starter-template` renders it with the new global `FrontendCmsPageFull` component, which loads the layout from `readCms post /cms/{id}` and marks the page `noindex`.
