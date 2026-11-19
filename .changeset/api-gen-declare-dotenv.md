---
"@shopware/api-gen": patch
---

Declare `dotenv` as a runtime dependency. It was imported (`dotenv/config`) but not declared, so the build inlined whatever version pnpm happened to hoist from other packages; it is now an external dependency pinned to `18.0.10`, like the package's other runtime dependencies.
