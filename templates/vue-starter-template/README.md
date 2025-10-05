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