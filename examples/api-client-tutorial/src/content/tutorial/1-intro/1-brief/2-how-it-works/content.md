---
type: lesson
title: How it works
editor: false
terminal: false
previews: false
---



# This is how it works

API _Client_ was created to enable developers to connect and making requests to Shopware 6 API Client more comfortable and with minimum setup.

## Architecture

The _Client_ itself is built upon [ofetch](https://github.com/unjs/ofetch), thanks to this the _Client_ works as same good in a browser and in node.js environments. It supports also `fetchOptions` like `redirect` or `timeout` that can be used while making a API calls.

### Exposed methods

#### `createAPIClient`

Factory method to get a _Client_ instance to work with `store-api` endpoints of **Store API** scope. [Read more](https://shopware.stoplight.io/docs/store-api/38777d33d92dc-quick-start-guide) about Store API concept.


#### `createAdminAPIClient`

Factory method to get a _Client_ instance to work with `api` endpoints of **Admin API scope**. [Read more](https://shopware.stoplight.io/docs/admin-api/twpxvnspkg3yu-quick-start-guide) about Admin API concept.


---

We will take a closer look of it in the next chapter.