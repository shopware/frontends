# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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

This tempalte uses [UnoCSS](https://unocss.dev/) for styling, which is a utility-first CSS framework. It is configured to use the [Tailwind CSS](https://tailwindcss.com/) classes.

The template also includes a [CMS Base nuxt layer](https://www.npmjs.com/package/@shopware/cms-base-layer) to provide the CMS components for Shopping Experiences integration. The layer is registered in the `nuxt.config.ts` file. In order to override the default Tailwind CSS configuration, you can create your own `uno.config.ts` file in the root of your project and extend the default configuration.

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