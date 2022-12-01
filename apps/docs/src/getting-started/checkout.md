# Create a checkout

In this chapter you will learn how to

- Fetch and display payment and shipping information
- Create an order summary (totals, taxes)
- Place an order

## Shipping and payment information

:::warning
Please remember that payment and shipping methods shouldn't be cached.
It is important to refresh data before displaying it.
:::

Before fetching, ensure the cart is not empty by using `refreshCart` in the `useCart` composable.

**Get shipping methods**

```ts
const { getShippingMethods } = useCheckout();

await getShippingMethods();
```

**Display shipping methods**

```vue
<script setup lang="ts">
const { shippingMethods } = useCheckout();

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    await setShippingMethod({ id: shippingMethodId });
  },
});
</script>
<template>
  <div v-for="shippingMethod in shippingMethods" :key="shippingMethod.id">
    <input
      :id="shippingMethod.id"
      v-model="selectedShippingMethod"
      :value="shippingMethod.id"
      name="shipping-method"
      type="radio"
    />
    <label :for="shippingMethod.id">
      {{ shippingMethod.name }}
    </label>
  </div>
</template>
```

**Get payment methods**

```ts
const { getPaymentMethods } = useCheckout();

await getPaymentMethods();
```

**Display payment methods**

```vue
<script setup lang="ts">
const { paymentMethods } = useCheckout();

const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    await setPaymentMethod({ id: paymentMethodId });
  },
});
</script>
<template>
  <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
    <input
      :id="paymentMethod.id"
      v-model="selectedPaymentMethod"
      :value="paymentMethod.id"
      name="payment-method"
      type="radio"
    />
    <label :for="paymentMethod.id">
      {{ paymentMethod.name }}
    </label>
  </div>
</template>
```

## Order summary

We can use some helper methods from `useCart` composable to display an order summary and format prices.

Refer to [formatting prices](prices.md) for more information on displaying prices.

:::warning
Totals should **not** be calculated by the frontend. All calculations should be done on the backend side.
:::

```vue
<script setup lang="ts">
const { refreshCart, cartItems, subtotal, totalPrice, shippingTotal } =
  useCart();
const { getFormattedPrice } = usePrice();
await refreshCart();
</script>
<template>
  <div>
    <div>
      <p>Subtotal</p>
      <p>{{ getFormattedPrice(subtotal) }}</p>
    </div>
    <div>
      <p>Shipping estimate</p>
      <p>{{ getFormattedPrice(shippingTotal) }}</p>
    </div>
    <div>
      <p>Order total</p>
      <p>{{ getFormattedPrice(totalPrice) }}</p>
    </div>
  </div>
</template>
```

## Place an order

Placing an order requires

- A valid shipping address
- A selected payment method
- A selected shipping method

After placing an order with the `createOrder` method, the cart is refreshed automatically.

```ts
const { createOrder } = useCheckout();

const order = await createOrder();
```

After creating an order, you can fetch order data. `orderId` is returned by the `createOrder` method from the `useCheckout` composable.
The backend allows fetching orders related only to the current user by checking the session.

```ts
const {
  loadOrderDetails,
  personalDetails,
  billingAddress,
  shippingAddress,
  order,
} = useOrderDetails({ order: { id: orderId } as any });

await loadOrderDetails();
```
