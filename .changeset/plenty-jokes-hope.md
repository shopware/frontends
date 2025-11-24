---
"@shopware/api-gen": minor
---

Enhanced OpenAPI schema override merging to properly handle conflicts between `$ref` and composition keywords (`oneOf`, `anyOf`, `allOf`, `not`). When merging overrides:

- Composition keywords now automatically remove conflicting `$ref` properties
- `$ref` overrides can replace composition keywords entirely
- Different composition keywords can replace each other (e.g., `allOf` → `oneOf`)

This ensures correct schema merging when using composition keywords in override files, preventing invalid OpenAPI schemas with conflicting `$ref` and composition keyword properties.
