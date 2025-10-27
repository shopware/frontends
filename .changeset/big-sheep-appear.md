---
"@shopware/cms-base-layer": minor
"@shopware/helpers": patch
---

## Summary

Introduce new UI components, refine listing filters (structure and UX), add global collapse animations, and improve type safety across helpers and components.

## @shopware/cms-base-layer (minor)

### Features
- New UI components:
  - SwFilterChips – shows active filters as removable chips
  - SwSortDropdown – sorting dropdown
  - SwProductListingPagination – listing pagination
  - Checkbox – reusable checkbox
  - ChevronIcon – configurable chevron (up/down/left/right)
  - RadioButton – reusable radio button
  - SwitchButton – toggle switch

### Refactors
- SwFilterProperties:
  - Replace computed factory with `isChecked()` and `selectValue()` helpers for better performance and readability.
- Filter collapse animation:
  - Unified expand/collapse animations for SwFilterProperties, SwFilterRating, SwFilterShippingFree, and SwFilterPrice using UnoCSS preflights.

### TypeScript fixes
- SwProductListingFilters:
  - Provide fallbacks (`?? []`, `?? ''`) when passing `getSortingOrders` and `getCurrentSortingOrder`.
- SwFilterChips:
  - Relax prop types to accept union types compatible with both full Shopware schemas and simplified helper types.

## @shopware/helpers (patch)

### Type updates
- ListingFilter type enhancements (in `filters.ts`):
  - Add optional `options?: Array<{ id: string; translated?: { name?: string } }>`
  - Add optional `entities?: Array<{ id: string; translated?: { name?: string } }>`
- Improve inference in `getListingFilters()` by asserting the empty array return type.

## Notes

- No breaking changes expected.
- Transition classes are globally available via UnoCSS preflights; no safelist required.

