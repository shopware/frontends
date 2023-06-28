---
nav:
  position: 50
---

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
const {
  shippingMethods,
  setShippingMethod,
  selectedShippingMethod: shippingMethod,
  getShippingMethods,
} = useCheckout();

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

The shipping method position on the list is determined by the `position` field settled on the admin panel. Sorting logic in `useCheckout.ts::getShippingMethods()`

You can also display:

- Shipping delivery time
- Shipping icon
- Shipping description

**Get payment methods**

```ts
const { getPaymentMethods } = useCheckout();

await getPaymentMethods();
```

**Display payment methods**

```vue
<script setup lang="ts">
const {
  paymentMethods,
  selectedPaymentMethod: paymentMethod,
  setPaymentMethod,
} = useCheckout();

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

## Personal information

Each guest user has to provide billing data.
Those data will be used to create a standard or temporary account.

```vue
<script setup lang="ts">
const state = reactive({
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  guest: false,
  billingAddress: {
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
});
const { register } = useUser();
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const invokeSubmit = () => {
  register(state);
};
</script>
<template>
  <form
    id="checkout-billing-address"
    name="checkout-billing-address"
    method="post"
    @submit.prevent="invokeSubmit"
  >
    <label for="salutation">Salutation</label>
    <select id="salutation" v-model="state.salutationId" name="salutation">
      <option disabled selected value="">Choose salutation...</option>
      <option
        v-for="salutation in getSalutations"
        :key="salutation.id"
        :value="salutation.id"
      >
        {{ salutation.displayName }}
      </option>
    </select>

    <label for="first-name">First name</label>
    <input
      id="first-name"
      v-model="state.firstName"
      type="text"
      name="first-name"
    />

    <label for="last-name">Last name</label>
    <input
      id="last-name"
      v-model="state.lastName"
      type="text"
      name="last-name"
    />

    <input id="create-account" v-model="state.guest" type="checkbox" />
    <label for="create-account">Do not create a customer account.</label>

    <label for="email-address">Email address</label>
    <input
      id="email-address"
      v-model="state.email"
      type="email"
      name="email-address"
    />

    <div v-if="!state.guest">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="state.password"
        type="password"
        name="password"
      />
    </div>

    <label for="street-address">Street address</label>
    <input
      id="street-address"
      v-model="state.billingAddress.street"
      type="text"
      name="street-address"
    />

    <label for="postal-code">ZIP / Postal code</label>
    <input
      id="postal-code"
      v-model="state.billingAddress.zipcode"
      type="text"
      name="postal-code"
    />

    <label for="city">City</label>
    <input
      id="city"
      v-model="state.billingAddress.city"
      type="text"
      name="city"
    />

    <label for="country">Country</label>
    <select
      id="country"
      v-model="state.billingAddress.countryId"
      name="country"
    >
      <option disabled selected value="">Choose country...</option>
      <option
        v-for="country in getCountries"
        :key="country.id"
        :value="country.id"
      >
        {{ country.name }}
      </option>
    </select>

    <button type="submit">Save</button>
  </form>
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
const { refreshCart } = useCart();

const order = await createOrder();
refreshCart();
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
