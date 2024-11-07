# Demo template (Nuxt)

![Shopware Frontends](.assets/shopware-frontends-logo.png)

This repository is an example demo application built with Shopware Frontends Framework and Nuxt 3.

**Interactive preview:**

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-demo-store)

**Deploy with Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshopware%2Ffrontends%2Ftree%2Fmain%2Ftemplates%2Fvue-demo-store)

## What's inside

- Nuxt 3 application
- Required libraries (API client, CMS components, composables, Nuxt 3 module)
- Pre-configured demo Shopware 6 API

## Requirements

Go to [Documentation > Requirements](https://frontends.shopware.com/framework/requirements.html) to see the details.

## Set up your Shopware 6 instance

To connect to a different API, adjust the API credentials in the `nuxt.config.ts` file:

`Shopware:`{`endpoint` and `accessToken`}.

## Install & Run

1. `pnpm i` to install dependencies
2. `pnpm dev` to run the project with the development server

## Generate your own API types

By default API types are delivered from our [demo instance](https://frontends-demo.vercel.app/).
To generate your own types use [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) CLI.

1. update `.env` file with your Shopware API information
2. load JSON schema from your instance `pnpx @shopware/api-gen loadSchema --apiType=store --filename=storeApiSchema.json`
3. generate types `pnpx @shopware/api-gen generateTypes --filename=storeApiSchema.json`

> [!NOTE]
> Do not edit your `storeApiSchema.d.ts` file. It will be overwritten on the next schema generation. Instead use your `shopware.d.ts` file to extend types.

## Production

Refer to to the Shopware documentation for best practices on deploying a production JavaScript application with Shopware: [Best Practices > Deployment](https://frontends.shopware.com/best-practices/deployment.html)

### Running the application with Node.js

Execute the `build` script to build the application:

```bash
pnpm build

# or npm run build
# or yarn build
```

Execute the `start` script to run the application:

```bash
pnpm start

# or npm run start
# or yarn start
```

### Running Composable Frontends with Docker

Have a look at the [docker-composable-frontends repository](https://github.com/shopwareLabs/docker-composable-frontends).

> [!NOTE]
> We recommend using a local Shopware 6 development instance ([devenv](https://developer.shopware.com/docs/guides/installation/devenv.html#devenv)) and then [configuring](https://frontends.shopware.com/getting-started/templates/demo-store-template.html#configure) Composable Frontends to use your local instance.

### Nitro presets

More information on generating different outputs can be found [here](https://nitro.unjs.io/deploy).
Our recommendation is to use `.env` file for changing platform presets
