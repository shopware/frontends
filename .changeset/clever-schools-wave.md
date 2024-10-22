---
"@shopware/api-gen": patch
---

Fix patching schema when there is an oveerite with the `_DELETE` key, and the value was not present in the original schema. In that case there is nothing to delete and value should be omitted.
