---
head:
  - - meta
    - name: og:title
      content: Shopware Frontends Requirements
  - - meta
    - name: og:description
      content: "Which Node.js version, package manager, IDE and extensions should you use to get started with Shopware Frontends?"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Requirements?fontSize=150px"
nav:
  position: 10
---

# Environment requirements

Shopware Frontends requires a Node.js runtime environment. Besides that, for development you can use your favourite package manager.

## Shopware API

Shopware Frontends does not differ between provisioning of the Shopware API. Both, cloud and self-managed Shopware 6 instances are supported.

Every development instance / setup template is pre-configured with a public demo API. That way you don't have to set up a Shopware instance yourself.

<PageRef title="Install Shopware 6" sub="Set up Shopware 6 for development" page="https://developer.shopware.com/docs/guides/installation/" target="_blank" />

## IDE

For an ideal development experience, we recommend using [VSCode](https://code.visualstudio.com/download) with the following extensions

- Vue Language Features (`Vue.volar`)
- Oxc - Code Formatter and linter (`oxc.oxc-vscode`)
- TS and JS Language Features (`vscode.typescript-language-features`)

If you are using the `demo-store-template`, we also recommend the following extension

- UnoCSS (`antfu.unocss`)

## Node.js

Shopware Frontends requires a Node.js runtime environment.

Supported versions:

- **v22.19** or newer
- **v24.11** or newer
- **v26** or newer

The floor comes from Nuxt 4.5. Node v18 and v20 are end of life and no longer
supported. Each template declares its own range in `package.json`, and its
manifest entry repeats it in the `node` field.

:::tip
Use [Node Version Manager](https://github.com/nvm-sh/nvm) to manage a Node.js version locally.

"Supported" signifies the framework is developed, run, and tested on mentioned versions.
:::

## Package manager

Use **pnpm**. The templates are developed and tested with it, and each one
ships a `pnpm.onlyBuiltDependencies` list so a fresh scaffold runs unattended.

```bash
npx tiged shopware/frontends/templates/vue-starter-template my-store && cd my-store
pnpm i && pnpm dev
```

:::info
`npm` is available out of the box with Node.js; pnpm needs a one-time install
(`npm i -g pnpm`, or enable Corepack).
:::

:::tip Which templates can be scaffolded
`templates/manifest.json` in the repository is the source of truth. Templates
marked `scaffoldable: true` carry a ready-to-run `scaffoldCommand`; the rest
cannot simply be copied out of the monorepo.

**Note:** The `vue-starter-template-extended` template uses Nuxt layers and requires additional setup. See the [template documentation](../introduction/templates/vue-starter-template-extended.html#setup-run) for instructions.
:::
