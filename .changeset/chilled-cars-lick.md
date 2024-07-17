---
"eslint-config-shopware": major
---

- Migrate config to the new Flat format
- Export also as ESM module

example:

```ts
// eslint.config.js
import shopwareConfig from "eslint-config-shopware";

export default [...shopwareConfig];
```