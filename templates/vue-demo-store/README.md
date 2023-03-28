# Demo template (Nuxt)

![Shopware Frontends](.assets/shopware-frontends-logo.png)

This repository shows an example of demo application built with Shopware Frontends Framework on Nuxt 3.

## What's inside

- Nuxt 3 application
- Required libraries installed (api-client, CMS components, composables, Nuxt 3 module)
- Demo Shopware 6 instnace configured as the API

## Requirements

Go to [Documentation > Requirements](https://shopware-frontends-docs.vercel.app/framework/requirements.html) to see the details.

## Set up your Shopware 6 instance

In order to have a different API connect to the app, adjust the API credentials in the `nuxt.config.ts` file:
`shopwareEndpoint` and `shopwareAccessToken`.

## Customize

Now, you can have a look on the pages and components and add your stuff there.

[TODO: explain cms overriding or link to the docs].

## Install & Run

1. `pnpm i` to install deps
2. `pnpm dev` to run the project in dev mode

## Try it online

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-demo-store)

## Production

There are many ways and many providers for deployment a production build of JS app. For more, read documentation [Best Practices > Deployment](https://shopware-frontends-docs.vercel.app/best-practices/deployment.html) section.

In this chapter we will cover:
- SSR on Node server
- How to dockerize it

### Node server

To set a production build to run on node-server (SSR), change `NITRO_PRESET` entry in `.env.production` file:

```
NITRO_PRESET="node-server"
```

Then, the `build` script will invoke building the application for provided preset:

```bash
pnpm build

# or npm run build
# or yarn build
```

The last step is to run `start` script in order to make the application running:

```bash
pnpm start

# or npm run start
# or yarn start
```

### Get app running as docker container

Create or edit a [Dockerfile](./Dockerfile) to:
- Have a node.js environment available
- Have a built project files copied
- Run `start` script as an entrypoint
- Have a [.dockerignore](./.dockerignore) file defined to optimize image size (optionally)

Prepare a docker image:

```bash
# run in a main template dir
docker build -t vue-demo-store .
```

Run a container from the image:

```bash
# the application is exposed via 3000 port and mapped to 3000 port on host
docker run -p3000:3000 vue-demo-store
```
