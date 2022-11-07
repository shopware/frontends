# Environment requirements

[[toc]]

## Node.js

Supported versions:

- **v16.x** LTS
- **v18.x** LTS

:::tip
Use [Node Version Manager](https://github.com/nvm-sh/nvm) to manage a Node.js version locally.

_Supported_ signifies the framework is developed, run, and tested on mentioned versions.
:::

## Package manager

Supported managers:

- pnpm
- npm
- yarn

:::info
`npm` package manager is available out of the box with Node.js installed. Other managers need manual installation.
:::

## Examples

### Installation

```bash
pnpm i
# or
npm install
# or
yarn
```

### Run dev server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

:::info
Other available commands (like `build`) are available in `scripts` section of `package.json` file.
:::
