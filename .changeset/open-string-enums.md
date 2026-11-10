---
"@shopware/api-gen": minor
---

Generate open string enums with autocompletion. A schema that combines string `enum` or `const` branches with a plain `string` branch in `anyOf`/`oneOf` now becomes `"invoice" | "storno" | (string & {})` instead of a union that TypeScript collapses to `string`.
