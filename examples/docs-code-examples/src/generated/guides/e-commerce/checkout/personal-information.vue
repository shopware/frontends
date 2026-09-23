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
