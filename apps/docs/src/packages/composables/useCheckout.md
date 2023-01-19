---
category: CMS
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# useCheckout

Checkout management

## Usage

```js
const {
  getPaymentMethods,
  paymentMethods,
  getShippingMethods,
  shippingMethods,
  createOrder,
  shippingAddress,
  billingAddress,
  selectedShippingMethod,
  setShippingMethod,
  selectedPaymentMethod,
  setPaymentMethod,
} = useCheckout();
```

## Live example

<StackBlitzLiveExample projectPath="shopware/frontends/tree/main/examples/use-checkout" openPath="/" />
