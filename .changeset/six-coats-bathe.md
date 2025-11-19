---
"@shopware/cms-base-layer": patch
---

Enhanced product reviews display with improved styling and features:
- Fixed iteration bug in SwProductReviews component
- Added reviewer name (externalUser) and shop feedback (comment) display
- Created reusable StarIcon component with filled/empty states using direct SVG imports
- Integrated SwProductReviews into CmsElementProductDescriptionReviews accordion
- Migrated to createResolver from @nuxt/kit for proper layer path resolution
