# typer

Enhance your VitePress documentation with TypeScript types inside your monorepo.

## Installation

Add the package as `devDependency` using your favorite package manager:

```sh
pnpm add -D @shopware-pwa/typer
```

Then, extend your's `vitepress` configuration by adding the vite plugins:

```ts
// vitepress config.js file
import { TsFunctionsList, TsFunctionDescription } from "@shopware-pwa/typer";

...
vite: {
    plugins: [
        TsFunctionsList(),
        TsFunctionDescription({
            // config goes here
        });
        ...
    ]
    ...
}
```

## How it works

1. Takes the name of the md file (if it's the index file, look for table of contents)
2. Look for the function under the same name, existing in available packages
3. Create reflection of the function
4. Look for `<-- DESCRIPTION_PLACEHOLDER -->` in your md file and put an type output there

### TsFunctionsList

Creates a list of exported, and public (`@public` tag) functions in your package.

The output is a table in this format:

| name              | description                           |
| ----------------- | ------------------------------------- |
| [useAddToCart](.) | Composable to add product to the Cart |
| ...               | ...                                   |

The name of a function is a link to the internal docs page.

### TsFunctionDescription

Generates a basic function information like:

- description
- signature
- returned type
- parameters
- exported API: properties and methods

Moreover, it replaces internally used type names by a link to corresponding type file in github repository like:

_Promise<Cart>_ will become _Promise<[Cart](https://github.com/shopware/frontends/blob/main/packages/types/shopware-6-client/models/checkout/cart/Cart.d.ts#L30)>_

## Prepare your docs first

First of, you need to prepare a proper structure of the docs in order to enable types resolving.

- put your package reference to the following structure:

  ```sh
  ./
  ├── my-package/
  │   ├── firstFunction.md
  │   ├── secondFunction.md
  ...
  ```

- have a TS files in your package directory:

      ```sh
      ./
      ├── my-package/
      |   ├── index.ts
      │   ├── firstFunction.ts
      │   ├── secondFunction.ts
      ...
      ```

  The md files in your documentation will be filled with type information taken from corresponding TS files.

Note that, when there is no corresponding \*.ts file, the resolver will try to find `index.ts` file as index file containing all exported function, and there the function will be searched.

Paths for type resolver and codebase are configured during plugin registration.

## TODO

- normalize resolved paths via `import { normalizePath } from 'vite'` for instance; for multiple OS usage
- ensure that dev dependencies should not be bundled
- minify plugin configuration and use more smart algorithms to resolve corresponding types
- use synchronized functions for file system actions to minimize promises
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/typer/CHANGELOG.md)

### Latest changes: 0.1.9

### Patch Changes

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _typedoc_ from **^0.24.8** to **^0.25.1**

- [#369](https://github.com/shopware/frontends/pull/369) [`bc7a2db2`](https://github.com/shopware/frontends/commit/bc7a2db292d67cc448a901c1b7a9b5cb7dfbcd04) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.4.7** to **^4.4.9**
