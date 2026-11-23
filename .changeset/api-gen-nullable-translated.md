---
"@shopware/api-gen": patch
---

Keep nullable string fields in generated `translated` types. A property typed `["string", "null"]` now becomes `null | string` in `translated` instead of being left out, so a schema that marks `Media.alt` nullable no longer drops `alt` from `Media["translated"]`. With the current Store API schema this also adds `uneceCode` to `Unit["translated"]`.
