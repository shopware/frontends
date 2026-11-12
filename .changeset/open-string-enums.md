---
"@shopware/api-gen": minor
---

Generate open string enums with autocompletion. A schema that combines string `enum` or `const` branches with a plain `string` branch in `anyOf` (`oneOf` is handled the same way) now becomes `"invoice" | "storno" | (string & {})` instead of a union that TypeScript collapses to `string`.

Regenerated types can narrow: a `Record` or mapped type keyed by such a field now requires every known value, so use `Partial<Record<…>>` there.
