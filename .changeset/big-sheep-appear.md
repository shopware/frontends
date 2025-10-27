---
"@shopware/cms-base-layer": minor
---

Introduce new UI components, refine listing filters (structure and UX), add global collapse animations, and improve type safety.

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

### Code quality improvements
- SwFilterPrice:
  - Remove unnecessary optional chaining on `props.selectedFilters` to prevent masking undefined errors
- Checkbox component:
  - Replace `outline-blue-500` with `outline-brand-primary` for brand consistency
  - Make `label` prop optional to support checkbox-only pattern
- SwFilterShippingFree:
  - Add i18n support using `useCmsTranslations` instead of hardcoded "free delivery" text
- SwFilterProperties:
  - Remove unnecessary empty label prop from Checkbox usage

**Note:** Transition classes are globally available via UnoCSS preflights.

