---
"@shopware/unocss-design-tokens-layer": patch
---

Load `presetWind3` from `@unocss/preset-wind3` instead of the `unocss` barrel in
`uno.runtime.config.ts`.

That file is imported by a client plugin, and the barrel statically re-exports
`@unocss/transformer-attributify-jsx`. That transformer depends on `oxc-parser`, whose
browser entry imports `@oxc-parser/binding-wasm32-wasi`. The binding is not present in a
production install, so the client bundle failed to build:

```
[vite]: Rolldown failed to resolve import "@oxc-parser/binding-wasm32-wasi"
from "oxc-parser/src-js/wasm.js"
```

The parser never runs in the browser. Importing the preset directly keeps it out of the
client graph and also stops a 1.4 MB `.wasm` file and its worker from being emitted into
the public bundle.
