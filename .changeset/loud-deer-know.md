---
"@shopware/api-gen": minor
---

Add API-specific configuration support for `store-api` and `admin-api` in `api-gen.config.json`. This allows configuring `rules` and `patches` separately for each API type. Root-level `rules` and `patches` are now deprecated but still supported for backwards compatibility.

Example:

```json
{
  "$schema": "./node_modules/@shopware/api-gen/api-gen.schema.json",
  "store-api": {
    "patches": ["storeApiSchema.overrides.json"],
    "rules": ["COMPONENTS_API_ALIAS"]
  },
  "admin-api": {
    "patches": ["adminApiSchema.overrides.json"]
  }
}
```
