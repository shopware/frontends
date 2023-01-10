---
category: CMS
---

# useAddress

Manage user addresses.

[[toc]]

## Usage

### Load and iterate over the customer addresses:

```vue{4,7}
<script setup lang="ts">
const { customerAddresses, loadCustomerAddresses } = useAddress();

loadCustomerAddresses();
</script>
<template>
    <div v-for="address in customerAddresses" :id="address.id">
        {{ address.firstName }} {{ address.lastName }}
        <!-- use other properties available in CustomerAddress type -->
    </div>
</template>
```

### Create a customer address:

```vue{4}
<script setup lang="ts">
const { createCustomerAddress } = useAddress();

const newAddress: CustomerAddress = await createCustomerAddress({
  city: "Berlin",
  countryId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
  salutationId: "a7c40f6321c547759c4d0c6031e6c609",
  firstName: "John",
  lastName: "Doe",
  street: "Karl-Marx-Allee 1",
  zipcode: "10178",
});
</script>
```

### Update a customer address

```ts{2}
const { updateCustomerAddress } = useAddress();
const updatedAddress = await updateCustomerAddress(
    Object.assign(
        {},
        address, // old address object we want to change
        { firstName: "Johnny" } // change the firstName value
    )
);
```

### Delete an address

```vue{9}
<script setup lang="ts">
const { customerAddresses, deleteCustomerAddress } = useAddress();

const address: CustomerAddress = {
    id: "2fbb5fe2e29a4d70aa5854ce7ce3e20b"
    // other properties omitted
}

await deleteCustomerAddress(address.id);

// then
customerAddresses.value?.find((customerAddress) => customerAddress.id === address.id)
// will return undefined
</script>
```

In case of no error thrown on successfully deleted address, then the list of available addresses will be refreshed automatically and the array of addresses will not contain the previously deleted one.

### Set an address as default billing address

Pass as an argument an ID of address you want to set as default one

```ts
await setDefaultCustomerBillingAddress("2fbb5fe2e29a4d70aa5854ce7ce3e20b");
```

### Set an address as default shipping address

Pass as an argument an ID of address you want to set as default one

```ts
await setDefaultCustomerShippingAddress("2fbb5fe2e29a4d70aa5854ce7ce3e20b");
```

The action succeeds if no exception is thrown.
