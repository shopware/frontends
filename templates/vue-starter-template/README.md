# Vue Starter Template

A Nuxt storefront foundation with all Shopware Frontends packages pre-configured.

**[Live Demo →](https://frontends-starter-template.vercel.app/)**

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Styling and Shopping Experiences integration

This template uses [UnoCSS](https://unocss.dev/) for styling and follows a layered setup:

- [`@shopware/cms-base-layer`](https://www.npmjs.com/package/@shopware/cms-base-layer) provides the CMS components for Shopping Experiences
- `@shopware/unocss-design-tokens-layer` provides the shared UnoCSS defaults and design tokens
- the local `uno.config.ts` extends the generated base config with template-specific safelists, fonts, and overrides

## Need a More Complete Example?

If you're looking for a more comprehensive example with pre-built pages, custom styling, and real-world e-commerce patterns, check out the [vue-starter-template-extended](../vue-starter-template-extended).

The extended template:
- Extends this base template as a Nuxt layer
- Includes a complete store theme (Lumora - Modern Home Scents)
- Demonstrates component overrides and customization patterns
- Shows how to work with Shopware CMS default setup
- Provides examples of custom pages, layouts, and styling

**Use the base template** (this one) when you want to start from scratch with minimal setup and maximum flexibility.

**Use the extended template** when you want to see a complete implementation or need a head start with pre-built components and styling.
