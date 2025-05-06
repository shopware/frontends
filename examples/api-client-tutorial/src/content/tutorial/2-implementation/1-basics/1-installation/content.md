---
type: lesson
title: Install
editor: false
terminal: false
previews: false
---

# Installation

:::info
The example uses [Vite](https://vite.dev/) as a build tool.
:::

```bash
pnpm add -D @shopware/api-client
# or
npm install -D @shopware/api-client
# or
yarn add -D @shopware/api-client
```

See the library placed in your `package.json` file:

```json add={13}
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "6.2.3",
    "@shopware/api-client": "canary"
  }
}
```

:::tip
Thanks to **Vite** and its [Automatic dependency discovery](https://vite.dev/guide/dep-pre-bundling.html#automatic-dependency-discovery) there is no difference if _Client_ library lands in `devDependencies` or `dependencies` 💙
:::
