---
"@shopware/api-gen": patch
---

Avoid schema loading when internal value `_DELETE_` is used for `$ref` key.

**parse** function of `json5` library tries to load a `$ref` by loading a file under the reference value, and that's why

> _ENOENT: no such file or directory, open '{cwd}/\_DELETE_'\_

error was being thrown when there was no `_DELETE_` schema available locally (in the same json schema).
