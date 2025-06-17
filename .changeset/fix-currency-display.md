---
"@shopware/composables": patch
---

ensure consistent currency symbol display across environments

The `Intl.NumberFormat` was displaying currency symbols inconsistently between local and CI environments. Added `currencyDisplay: "symbol"` option to ensure consistent currency symbol display (e.g., "$" instead of "US$").
