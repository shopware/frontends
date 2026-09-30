---
"@shopware/design-tokens": minor
"@shopware/unocss-design-tokens-layer": patch
---

Added `@shopware/design-tokens`, the framework-agnostic source of the Shopware Frontends color tokens. It ships them as TypeScript (`colors`, `designTokenTheme`), as CSS custom properties (`tokens.css`), as a Tailwind CSS v4 theme (`tailwind.css`) and as JSON (`tokens.json`).

`@shopware/unocss-design-tokens-layer` now re-exports `designTokenTheme` from it instead of keeping its own copy, so the UnoCSS and Tailwind CSS themes cannot drift apart. The values and the exported shape are unchanged.
