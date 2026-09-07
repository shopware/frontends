# @shopware/api-client — agent notes

A thin, fully typed wrapper around [ofetch](https://github.com/unjs/ofetch) for
the Shopware Store API and Admin API.

Setup, type customization and usage examples are in [README.md](README.md).
The file layout and exports are discoverable from `src/`. This file holds only
what neither makes obvious.

## The `operations` generic is the whole design

Type safety flows from one generic parameter:

```
createAPIClient<operations>()  →  client.invoke("operationId method /path", body)
                                            ↑ typed by the operations key
```

`operations` maps `"operationId method /path"` keys to `body`, `query`,
`pathParams`, `response` and `responseCode`. It comes from one of three places,
and knowing which one a project uses explains most type errors:

1. **Bundled defaults** — `@shopware/api-client/store-api-types` or
   `/admin-api-types`.
2. **Generated from an instance** — `./api-types/storeApiTypes`, produced by
   `@shopware/api-gen`.
3. **Extended** — `./api-types/storeApiTypes.overrides.ts`, merging generated
   types with custom ones.

**Never hand-edit `api-types/*.d.ts`** — they are generated artifacts.
Regenerate with `pnpm run generate-types` from the repo root.

## Non-obvious extension points

- **New hooks** go into the `ApiClientHooks` / `AdminApiClientHooks` types
  (`src/createAPIClient.ts`, `src/createAdminAPIClient.ts`) first — those types
  parameterise `createHooks<...>()` from hookable, so the type is what makes a
  hook name callable and consumer-visible, not the call site.
- **New `fetchOptions`** are an explicit allow-list, not a passthrough: add the
  option to the `Pick` list in `InvokeParameters["fetchOptions"]` in
  `src/createAPIClient.ts` (and to `GlobalFetchOptions` if it should be settable
  client-wide), then document it in the README. Anything not in the `Pick` is
  dropped without warning.
- **`api-types/storeApiSchema.overrides.json`** ships as the default patch set
  that `api-gen` users reference from their own config. Keep it in sync whenever
  the bundled types are regenerated, or downstream generation drifts from ours.

## Tests

Vitest against a mock HTTP server — no Shopware instance needed. Tests sit next
to sources, with extra suites in `src/tests/`.

Some behaviour is runtime-dependent (abort and rejection messages differ between
Node and `happy-dom`), so those cases are split by environment: `*.test.ts` runs
in Node, `*.browser.test.ts` in happy-dom. **The
`// @vitest-environment happy-dom` docblock must be on the FIRST line of the
file** — Vitest applies it to the whole file wherever it sits, so putting it
inside an `it()` silently flips every test in that file.

Request `Content-Type` handling is *not* environment-dependent:
`resolveRequestHeaders` decides it from the body alone. The browser test file
only guards that Node and browser stay in sync.
