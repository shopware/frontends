---
"@shopware/cms-base-layer": patch
---

Give the `CmsSectionSidebar` `<aside>` an accessible name so pages with more than one complementary landmark pass the axe `landmark-unique` rule. New translation key: `layout.ariaLabels.contentSidebar` (default "Content sidebar"). Add it to your locale files.
