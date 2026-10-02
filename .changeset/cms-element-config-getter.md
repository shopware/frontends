---
"@shopware/composables": minor
---

`useCmsElementConfig` accepts a `ref` or a getter. `getConfigValue` reads the element on every call, so a component that passes `() => props.content` follows a new `content` instead of the one it was set up with. Passing a plain object works as before.
