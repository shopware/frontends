# @shopware/api-client — agent notes

A thin, fully typed wrapper around [ofetch](https://github.com/unjs/ofetch) for
the Shopware Store API and Admin API.

Setup, type customization and usage examples are in [README.md](README.md).
The file layout and exports are discoverable from `src/`. This file holds only
what neither makes obvious.

## The `operations` generic is the whole design

Type safety flows from one generic parameter:

```
createAPIClient<operations>()
  → client.invoke("operationId method /path", params)
                   ↑ key typed by operations   ↑ { body, query, pathParams,
                                                   headers, fetchOptions }
```

`operations` maps `"operationId method /path"` keys to `body`, `query`,
`pathParams`, `response` and `responseCode`. It comes from one of three places,
and knowing which one a project uses explains most type errors:

1. **Bundled defaults** — `@shopware/api-client/store-api-types` or
   `/admin-api-types`. This is the default for templates and examples.
2. **Local TypeScript overrides** — `./api-types/storeApiTypes.overrides.ts`
   merged with `WithApiOverrides` in `shopware.d.ts`. No generated `.d.ts`.
   Required for StackBlitz examples that add plugin endpoints.
3. **Generated from an instance** — `./api-types/storeApiTypes`, produced by
   `@shopware/api-gen` after `loadSchema`. Only needed when the schema itself
   differs from the shipped default.

**Never hand-edit `api-types/*.d.ts`** — they are generated artifacts.
**Never commit generated `storeApiTypes.d.ts` outside this package.** The
monorepo gitignores those copies; examples with extra endpoints keep only
`*.overrides.ts`. `pnpm run generate-types` from the repo root regenerates the
**store** types in this package; `adminApiTypes.d.ts` comes from this
package's separate `generate-admin-types` script, which no root script wraps.

## Non-obvious extension points

- **New hooks** go into the `ApiClientHooks` / `AdminApiClientHooks` types
  (`src/createAPIClient.ts`, `src/createAdminAPIClient.ts`) first — those types
  parameterise `createHooks<...>()` from hookable, so the type is what makes a
  hook name callable and consumer-visible, not the call site.
- **New `fetchOptions`** need adding to the `Pick` list in
  `InvokeParameters["fetchOptions"]` in `src/createAPIClient.ts` (and to
  `GlobalFetchOptions` if it should be settable client-wide), then documenting in
  the README. That `Pick` is a **type-level** allow-list and nothing filters it
  at runtime: the object is spread into ofetch verbatim, so an unlisted key that
  gets past the types still reaches ofetch and still changes the request. The
  type only catches it as an excess property when you pass an object _literal_ —
  a prepared variable carrying an extra key compiles cleanly. `method`, `body`,
  `headers` and `query` are the exceptions: `invoke` re-sets those after the
  spread.
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

Request `Content-Type` handling is _not_ environment-dependent, so the browser
test file only guards that Node and the browser stay in sync. It is not decided
from the body alone either: `resolveRequestHeaders` weighs the caller's header
against the default, whether that default is the seeded `application/json`,
multipart boundary usability, and header-casing collisions. An explicit
non-JSON caller `Content-Type` wins for a runtime-managed body — a Blob's
`image/png` survives — **except** for `FormData`, where a `Content-Type` without
a boundary cannot describe the body and is dropped whatever the caller set (see
`shouldDrop`, pinned by a test). Keep both branches when touching it, or Blob
uploads or multipart break.
