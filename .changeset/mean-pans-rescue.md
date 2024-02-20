---
"@shopware/api-client": minor
---

Management of defaultHeaders. You can now set them on apiClient init or runtime.

```ts
const apiClient = createApiClient({
  ...,
  defaultHeaders: {
    'sw-language-id': 'my-id',
  },
});

console.log('Debug default headers:', apiClient.defaultHeaders);

// Change header runtime
apiClient.defaultHeaders['sw-language-id'] = 'my-new-id';

// Remove header runtime
apiClient.defaultHeaders['sw-language-id'] = "";

// Change multiple headers runtime
apiClient.defaultHeaders.apply({
  'sw-language-id': 'another-id',
  'sw-currency-id': 'currency-id',
})
```
