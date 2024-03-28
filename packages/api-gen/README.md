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
OPENAPI_JSON_URL="https://your-shop-instance.shopware.store"
OPENAPI_ACCESS_KEY="YOUR_STORE_API_ACCESS_KEY"
SHOPWARE_ADMIN_USERNAME="my@username.com"
SHOPWARE_ADMIN_PASSWORD="my-password"
```

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-gen/CHANGELOG.md)

### Latest changes: 0.2.0

### Minor Changes

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - `loadSchema` command added by splitting `generate` command

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Sorting `paths` in the same order by api patchs

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Command `generate` has been splitted and doing only transformation from json to d.ts file

- [#564](https://github.com/shopware/frontends/pull/564) [`93a6048`](https://github.com/shopware/frontends/commit/93a6048ee28c1975750ef6911f303ea095cb9941) Thanks [@patzick](https://github.com/patzick)! - Added `apiType` option in `loadSchema` command. With `SHOPWARE_ADMIN_USERNAME` and `SHOPWARE_ADMIN_PASSWORD` env variables we can now authorize Admin API schema.

  example:

  ```bash
  # load schema from store API
  pnpx @shopware/api-gen loadSchema --apiType=store --filename=storeApiSchema.json

  # load schema from admin API
  pnpx @shopware/api-gen loadSchema --apiType=admin --filename=adminApiSchema.json
  ```

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Schema `operations` is now a generic type to help with overriding types

### Patch Changes

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Generated `GenericRecord` is more open to avoid type problems

- Updated dependencies [[`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8)]:
  - @shopware/api-client@0.6.0
