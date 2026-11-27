---
"@shopware/cms-base-layer": patch
"vue-starter-template": patch
"react-starter-template": patch
---

The product listing grid now carries `data-testid="listing-results"` and echoes the listing response on it: `data-sorting` holds the applied sorting, `data-manufacturer` and `data-properties` hold the applied filter ids joined with `|`. The values come from the Store API response (`sorting` and `currentFilters`), not from the URL, so e2e tests can wait until the listing reflects a filter or sort without watching network traffic. This covers the CMS product listing and the search page in both starter templates.
