<script setup lang="ts">
const state = ref({
  firstName: "",
  lastName: "",
  street: "",
  zipcode: "",
  city: "",
  country: "",
});

const { getCountriesOptions } = useCountries();
</script>

<template>
  <form class="flex flex-col gap-4">
    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.firstName"
        id="first-name"
        :label="$t('checkout.customerAddress.firstNameLabel')"
        :placeholder="$t('checkout.customerAddress.firstNamePlaceholder')"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.lastName"
        id="last-name"
        :label="$t('checkout.customerAddress.lastNameLabel')"
        :placeholder="$t('checkout.customerAddress.lastNamePlaceholder')"
      />
    </div>
    <div>
      <FormInputField
        v-model="state.street"
        id="street"
        :label="$t('checkout.customerAddress.streetLabel')"
        :placeholder="$t('checkout.customerAddress.streetPlaceholder')"
      />
    </div>
    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.zipcode"
        id="zipcode"
        :label="$t('checkout.customerAddress.zipcodeLabel')"
        :placeholder="$t('checkout.customerAddress.zipcodePlaceholder')"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.city"
        id="city"
        :label="$t('checkout.customerAddress.cityLabel')"
        :placeholder="$t('checkout.customerAddress.cityPlaceholder')"
      />
    </div>
    <div>
      <FormDropdownField
        id="country"
        v-model="state.country"
        :label="$t('checkout.customerAddress.countryLabel')"
        :placeholder="$t('checkout.customerAddress.countryPlaceholder')"
        :options="getCountriesOptions"
      />
    </div>
  </form>
</template>
