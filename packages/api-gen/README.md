# shopware/frontends - api-gen

Welcome to `@shopware/api-gen` CLI.
Generate TypeScript schemas from Shopware OpenAPI specification.

After generating schemas, you can use them in fully typed [API Client](https://www.npmjs.com/package/@shopware/api-client).

## Usage

```bash
# Using pnpm
pnpx add @shopware/api-gen [command]

# Using npm
npx i @shopware/api-gen [command]
```

## Commands

### `generate`

Transform OpenAPI specification from JSON file to Typescript schemas. Use `loadSchema` command first.

options:

```bash
pnpx @shopware/api-gen generate --help

# generate schemas from store API
pnpx @shopware/api-gen generate --filename=storeApiSchema.json

# generate schemas from admin API
pnpx @shopware/api-gen generate --filename=adminApiSchema.json
```

### `loadSchema`

Load OpenAPI specification from Shopware instance and save it to JSON file.

options:

```bash
pnpx @shopware/api-gen loadSchema --help

# load schema from store API
pnpx @shopware/api-gen loadSchema --apiType=store --filename=storeApiSchema.json

# load schema from admin API
pnpx @shopware/api-gen loadSchema --apiType=admin --filename=adminApiSchema.json
```

Remember to add `.env` file in order to authenticate with Shopware instance.

```bash
OPENAPI_JSON_URL="https://demo-frontends.shopware.store"
OPENAPI_ACCESS_KEY="SWSCBHFSNTVMAWNZDNFKSHLAYW"
SHOPWARE_ADMIN_USERNAME="my@username.com"
SHOPWARE_ADMIN_PASSWORD="my-password"
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-gen/CHANGELOG.md)

### Latest changes: 0.1.1

### Patch Changes

- [#462](https://github.com/shopware/frontends/pull/462) [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.7.0** to **^6.7.1**
  - Changed dependency _prettier_ from **^3.0.3** to **^3.1.0**
