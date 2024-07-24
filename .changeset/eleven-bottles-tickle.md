---
"@shopware/api-client": patch
---

Update `handlePaymentMethod` operation to have `paymentDetails` parameter available:

```ts
apiClient.invoke(
  "handlePaymentMethod post /handle-payment",
  {
    body: {
      orderId,
      errorUrl,
      finishUrl,
      paymentDetails, // NEW PARAMETER AVAILABLE
    },
  },
);
```