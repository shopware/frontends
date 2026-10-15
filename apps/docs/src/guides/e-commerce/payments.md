---
head:
  - - meta
    - name: og:title
      content: "Payments"
  - - meta
    - name: og:description
      content: "Authenticate requests from a headless storefront to a payment app server."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Working%20with%20**Payments**.png"
---

# Payments

The payment flow itself — placing the order first, handing it to `handle-payment`, following the redirect and reading the transaction state on the return page — is covered end-to-end in the [Payment recipe](../../frontends-recipes/checkout/payment.html). This page covers what the recipe does not: authenticating a headless storefront against a payment app server.

:::tip Prior knowledge

- [Payments concept](https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments)
- [Payment API](https://shopware.stoplight.io/docs/store-api/8218801e50fe5-handling-the-payment)

:::

<PageRef page="../../integrations/payments/" title="Payment Integrations" sub="See also all our Payment Integrations." />

## App server integration

When a payment method uses an app server, for example as a [gateway](https://developer.shopware.com/docs/guides/plugins/apps/gateways/checkout/checkout-gateway.html) or middleware, there are some key information needed to identify the client source and the store related to the app itself.

In detached API consumer like headless app, the mentioned information can be obtained by using a [tailored endpoint](https://developer.shopware.com/docs/guides/plugins/apps/clientside-to-app-backend.html):

⚠️ **works only for logged-in customers**

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/e-commerce/payments/app-server-integration.ts" code lang="ts" no-name -->

```ts
import { useShopwareContext } from "#imports";

const { apiClient } = useShopwareContext(); // or use an instance of @shopware/api-client library

const tokenResponse = await apiClient.invoke(
  "generateJWTAppSystemAppServer post /app-system/{name}/generate-token",
  {
    pathParams: {
      name: "MyPaymentApp",
    },
  },
);
```

<!-- /automd -->

The response may look like this:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/e-commerce/payments/app-server-integration.json" code lang="json" no-name -->

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJVZXF4S1RtSHBKVHZmZkRQIiwiaWF0IjoxNzMzNDA5NTM3LjQ1NzYxMSwibmJmIjoxNzMzNDA5NTM3LjQ1NzYxMywiZXhwIjoxNzMzNDEwMTM3LjQ1BzUzOSwic2FsZXNDaGFubmVsSWQiOiI4ODQzMmRlZjM5ZmM0NjI0YjMzMjEzYTU2YjhjOTQ0ZCJ9.M2GZ6hFFBgQAgoAQAVC--aIG2pl5wytEBBwpCN0UFCw",
  "expires": "2024-12-05T14:48:57+00:00",
  "shopId": "QeqxZlmHpJBvfvDP"
}
```

<!-- /automd -->

Since the endpoint returns a `jwt` token containing all required data to identify the further requests: `salesChannelId` and `shopId`. Therefore using the `jwt` token should be the only way of authorization, in a request's header. The token is valid for 10 minutes by default.

For example:

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/e-commerce/payments/app-server-integration-2.ts" code lang="ts" no-name -->

```ts
const tokenResponse = {
  data: {
    token: "example-jwt",
  },
};

await fetch("https://shopware.mypaymentgateway.com/api/store/card", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenResponse.data?.token}`, // jwt token from the sample code above
  },
  body: JSON.stringify({
    cardId: "card_123",
    tokenId: "some-secret-token_123",
  }),
});
```

<!-- /automd -->
