---
"@shopware/unocss-design-tokens-layer": patch
---

Re-export `designTokenTheme` from `@shopware/design-tokens` instead of keeping its own copy, so the UnoCSS and Tailwind CSS themes cannot drift apart. The values and the exported shape are unchanged.
