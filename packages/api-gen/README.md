# shopware/frontends - api-gen

Welcome to `@shopware/api-gen` CLI.
Generate TypeScript schemas from Shopware OpenAPI specification.

After generating schemas, you can use them in fully typed [API Client](https://www.npmjs.com/package/@shopware/api-client).

## Usage

<!-- automd:pm-install name="@shopware/api-gen" dev -->

```sh
# ✨ Auto-detect
npx nypm install -D @shopware/api-gen

# npm
npm install -D @shopware/api-gen

# yarn
yarn add -D @shopware/api-gen

# pnpm
pnpm install -D @shopware/api-gen

# bun
bun install -D @shopware/api-gen
```

<!-- /automd -->

## Features

Generator will create a new directory `api-types` with TypeScript schemas inside. Depending on the `apiType` parameter it will create `storeApiTypes.ts` or `adminApiTypes.ts` file.

### Overriding

If your instance contains inacurate or outdated OpenAPI specification, you can override it by creating a new file inside `api-types` directory::

- `storeApiTypes.overrides.ts` for store API
- `adminApiTypes.overrides.ts` for admin API

Example of overrides file:

<!-- automd:file src="./tests/snapshots-override/simpleOverride.example.ts" code -->

```ts [simpleOverride.example.ts]
import { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents & {
  schemas: Schemas;
};

export type Schemas = {
  CustomerAddress: {
    qwe: string;
  };
};

export type operations = {
  "myNewEndpointWithDifferentBodys post /aaaaa/bbbbb":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        body: components["schemas"]["CustomerAddress"];
        response: components["schemas"]["Country"];
        responseCode: 201;
      }
    | {
        contentType: "application/xml";
        accept?: "application/json";
        body: {
          someting: boolean;
        };
        response: {
          thisIs200Response: string;
        };
        responseCode: 200;
      };
  "updateCustomerAddress patch /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    /**
     * We're testing overrides, assuming update address can only update the city
     */
    body: {
      city: string;
    };
    response: components["schemas"]["CustomerAddress"];
    responseCode: 200;
  };
};
```

<!-- /automd -->

## Commands

### add shortcut to your `package.json` scripts

```json
{
  "scripts": {
    "generate-types": "shopware-api-gen generate --apiType=store"
  }
}
```

then running `pnpm generate-types` will generate types in `api-types` directory.

### `generate`

Transform OpenAPI specification from JSON file to Typescript schemas. Use `loadSchema` command first.

options:

```bash
pnpx @shopware/api-gen generate --help

# generate schemas from store API
pnpx @shopware/api-gen generate --apiType=store

# generate schemas from admin API
pnpx @shopware/api-gen generate --apiType=admin
```

### `loadSchema`

Load OpenAPI specification from Shopware instance and save it to JSON file.

options:

```bash
pnpx @shopware/api-gen loadSchema --help

# load schema from store API
pnpx @shopware/api-gen loadSchema --apiType=store

# load schema from admin API
pnpx @shopware/api-gen loadSchema --apiType=admin
```

Remember to add `.env` file in order to authenticate with Shopware instance.

```bash
OPENAPI_JSON_URL="https://your-shop-instance.shopware.store"
## This one needed to fetch store API schema
OPENAPI_ACCESS_KEY="YOUR_STORE_API_ACCESS_KEY"
## These two needed to fetch admin API schema
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
