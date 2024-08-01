# B2B Quick Order

This example should help get you started developing [Shopware Frontends](https://github.com/shopware/frontends) & Quick Order from [Commercial Features](https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components)

⚠️ The implementation does not require an API Schema defined on the Quick Order extension side. The required definitions are added in `./api-types/storeApiTypes.overrides.ts`. However, when any extension has it implemented - that will land right into base OpenAPI schema -> like here `api-types/storeApiTypes.d` as a result of [api-gen](https://www.npmjs.com/package/@shopware/api-gen) command.

## Customization

- edit [./src/App.vue](./src/App.vue) in order to change the current example's logic, look & feel.
- edit [./src/main.js](./src/main.js) in order to adjust Shopware Frontends plugin

## Overview of example

- `./api-types/storeApiTypes.overrides.ts` file contains the additional definitions to make sure an `api-client` knows the schemas and operations added by an extension
- `./src/App.vue` containing a logic for: searching and adding items, uploading a csv file with a specific format. See the comments left there.

## Project Setup

```sh
pnpm install
```

## Configuration

In order to use the example, you need to:

- Have a running Shopware 6 instance (Evolve plan or Beyond if hosted on Cloud, or Commercial plugin installed).

  Rename `.env.template` to `.env` and Put an API URL and API Access Key of your Shopware instance:

  ```
  VITE_SHOPWARE_API="https://201023-quick-order.swstage.store/"
  VITE_SHOPWARE_ACCESS_KEY="SWSCBHFSNTVMAWNZDNFKSHLAYW"
  ```

- Have a customer account with B2B Quick Order feature activated.

- Provide the credentials for the customer (previous step) by editing `.env` file:

  ```sh
  VITE_TEST_LOGIN_EMAIL="myb2bcustomer@shopware.com"
  VITE_TEST_LOGIN_PASSWORD="!@#verysecretpasswd"
  ```

### Run for development

```sh
pnpm dev
```

or...

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shopware/frontends/tree/main/examples/commercial-quick-order?file=README.md)

⚠️ Remember to prepare your app first, see **Configuration** chapter above.

## 📁 Import file feature

file upload can be tested in that format:

```
product_number,quantity
SW10096.3,2
SW10079,5
```

You can use [products.csv](./products.csv)
