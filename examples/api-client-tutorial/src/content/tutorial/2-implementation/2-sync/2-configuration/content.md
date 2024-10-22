---
type: lesson
title: Setup
focus: /example.ts
previews: false
openInStackBlitz: false
autoReload: false
terminal: false
editor: false

---

# Setup

The library we are going to install was created to:
- get the OpenAPI Schema definitions for the given instance
- generate TypeScript as an input for `@shopware/api-client`

## Install

```bash
pnpm add -D @shopware/api-gen
# or
npm install -D @shopware/api-gen
# or
yarn add -D @shopware/api-gen
```

:::tip
If you don't want to have the package locally, you can use it via some executable manager later:

```bash
pnpx @shopware/api-gen <COMMAND>
#or
npx @shopware/api-gen <COMMAND>
#...
```
:::

## Configure

Create `.env` file in the project you work on.

The file must contain two variables:

- `OPENAPI_JSON_URL` - pointing your Shopware 6 instance
- `OPENAPI_ACCESS_KEY` - the corresponding access key you can find in your Sales Channels config in Admin Panel

You should get something similar to this:

```bash file=".env"
# .env
OPENAPI_JSON_URL="http://localhost:8000"
OPENAPI_ACCESS_KEY="SWSCZJLOU1JXSWX2A3RSR3EWYG"
```