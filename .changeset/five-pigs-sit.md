---
"@shopware/helpers": patch
---

Extended `ListingFilter` type to support property options and manufacturer entities:

- Added optional `options` property for property group options
- Added optional `entities` property for manufacturer entities
- Improved type safety by explicitly typing empty array return in `getListingFilters()`
