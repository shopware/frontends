---
"@shopware-pwa/composables-next": patch
---

Update `useOrderPayment` composable's `handlePayment` method to accept also additional payment details as a last argument:

```ts
const { handlePayment } = useOrderPayment(/** args ommited */);

await handlePayment(
  "http://localhost:3000/success",
  "http://localhost:3000/failure?payment-failed",
  {
    stateData // pass extra parameter fro api payment processor
  },
);

```