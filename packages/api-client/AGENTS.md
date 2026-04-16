# AI Agent Guide for @shopware/api-client

This document provides guidance for AI assistants working with the `@shopware/api-client` package.

## TL;DR

**What**: Fully typed HTTP client for Shopware 6 Store API and Admin API
**Tech**: TypeScript, ofetch, openapi-fetch-runtime
**Types**: Generated from OpenAPI spec via `@shopware/api-gen` CLI

**Quick Start**:
```bash
pnpm run build    # Build the package
pnpm run dev      # Stub mode for development (hot reload)
pnpm run test     # Run tests
```

**Before commits**: `pnpm run lint:fix && pnpm format && pnpm run typecheck`

## Package Overview

`@shopware/api-client` is a thin, typed wrapper around [ofetch](https://github.com/unjs/ofetch). Its key feature is the `operations` generic that carries OpenAPI operation types end-to-end — from the `invoke()` call signature to the return type. Users either import the bundled default types or replace them with types generated from their own Shopware instance via `@shopware/api-gen`.

## Directory Structure

```
api-client/
├── src/
│   ├── createAPIClient.ts         # Store API client factory
│   ├── createAdminAPIClient.ts    # Admin API client factory
│   ├── errorInterceptor.ts        # ApiClientError + error parsing
│   ├── helpers.ts                 # encodeForQuery helper
│   └── index.ts                   # Public exports
├── api-types/
│   ├── storeApiTypes.d.ts         # Bundled Store API types (generated)
│   ├── adminApiTypes.d.ts         # Bundled Admin API types (generated)
│   └── storeApiSchema.overrides.json  # Default JSON patches applied during generation
├── src/fetch/                     # Low-level fetch wrappers
└── _tests/                        # Vitest tests with mock server
```

## Key Files

- [src/createAPIClient.ts](src/createAPIClient.ts) — `createAPIClient<operations>()` factory; hooks, context token management, `invoke()`
- [src/createAdminAPIClient.ts](src/createAdminAPIClient.ts) — `createAdminAPIClient<operations>()` factory; OAuth2 (password + client_credentials), session persistence
- [src/errorInterceptor.ts](src/errorInterceptor.ts) — `ApiClientError` class with parsed API error details
- [src/helpers.ts](src/helpers.ts) — `encodeForQuery()` for compressed GET criteria
- [api-types/storeApiSchema.overrides.json](api-types/storeApiSchema.overrides.json) — default patches shipped with the package (referenced by `api-gen` users)

## Type System

The entire type safety model flows from a single generic parameter `operations`:

```
createAPIClient<operations>()  →  client.invoke("operationId method /path", body)
                                             ↑ typed by operations key
```

The `operations` type is a map of `"operationId method /path"` keys to objects describing `body`, `query`, `pathParams`, `response`, and `responseCode`.

**Three sources for `operations`**:
1. **Bundled default** — `@shopware/api-client/store-api-types` or `@shopware/api-client/admin-api-types`
2. **Generated from instance** — `./api-types/storeApiTypes` (via `@shopware/api-gen`)
3. **Extended/overridden** — `./api-types/storeApiTypes.overrides.ts` (merges generated + custom)

When working on this package, never edit `api-types/*.d.ts` manually — they are generated artifacts. To regenerate them, use `@shopware/api-gen` with the appropriate schema.

## Common Tasks

### Adding a hook

Hooks are registered in `createAPIClient.ts` / `createAdminAPIClient.ts`. Available hook names are typed via the `ClientHooks` interface. Add new hook types there first, then wire them into the fetch lifecycle.

### Fixing error handling

Error parsing lives in `errorInterceptor.ts`. The `ApiClientError` class wraps raw API responses and exposes `details` for structured error data.

### Updating bundled types

Bundled types (`api-types/*.d.ts`) are generated — do not edit them. To update:
```bash
# From repo root
pnpm run generate-types
```
This runs `@shopware/api-gen` against the configured Shopware instance and regenerates the `.d.ts` files.

### Adding new `fetchOptions`

The allowed subset of `ofetch` options is explicitly listed in the client types. If a new option needs to be exposed, add it to the `FetchOptions` type in `src/createAPIClient.ts` and document it in the README.

## Testing

Tests live in `_tests/` and use Vitest with a mock HTTP server (no real Shopware instance needed).

```bash
pnpm run test          # Run all tests
pnpm run test:watch    # Watch mode
```

Tests exercise `invoke()` calls, hook firing, error parsing, and auth flows. When adding features, add matching tests.

## Relationship with @shopware/api-gen

`@shopware/api-gen` is the CLI companion that produces the `operations` and `components` types consumed here. The two packages are decoupled — `api-client` ships default types for convenience, but end users are encouraged to generate their own.

The default patches file `api-types/storeApiSchema.overrides.json` is referenced by `api-gen` users via:
```json
{ "store-api": { "patches": ["./node_modules/@shopware/api-client/api-types/storeApiSchema.overrides.json"] } }
```

Keep this file in sync when the bundled types are regenerated.

## References

- [README.md](README.md) — User-facing docs including setup, type customization, usage examples
- [@shopware/api-gen](../api-gen/README.md) — Type generation CLI
- [frontends.shopware.com](https://frontends.shopware.com/) — Full documentation
