<script setup lang="ts">
import type { Regle } from "@regle/core";

import type { Schemas } from "#shopware";

const state = defineModel<
  Omit<Schemas["CustomerAddress"], "id" | "customerId">
>({
  required: true,
});

const { errorMessages } = defineProps<{
  errorMessages?: Ref<
    Regle<Omit<Schemas["CustomerAddress"], "id" | "customerId">>["r$"]
  >;
}>();
</script>

<template>
  <form class="flex flex-col gap-4">
    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.firstName"
        id="first-name"
        data-testid="checkout-pi-first-name-input"
        :label="$t('checkout.customerAddress.firstNameLabel')"
        :placeholder="$t('checkout.customerAddress.firstNamePlaceholder')"
        :errorMessage="errorMessages?.value?.firstName?.$errors?.[0] ?? ''"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.lastName"
        id="last-name"
        data-testid="checkout-pi-last-name-input"
        :label="$t('checkout.customerAddress.lastNameLabel')"
        :placeholder="$t('checkout.customerAddress.lastNamePlaceholder')"
        :errorMessage="errorMessages?.value?.lastName?.$errors?.[0] ?? ''"
      />
    </div>
    <div>
      <FormInputField
        v-model="state.street"
        id="street"
        data-testid="checkout-pi-street-address-input"
        :label="$t('checkout.customerAddress.streetLabel')"
        :placeholder="$t('checkout.customerAddress.streetPlaceholder')"
        :errorMessage="errorMessages?.value?.street?.$errors?.[0] ?? ''"
      />
    </div>
    <div class="flex gap-4">
      <FormInputField
        v-if="state.zipcode !== undefined"
        class="basis-1/2"
        v-model="state.zipcode"
        id="zipcode"
        data-testid="checkout-pi-zip-code-input"
        :label="$t('checkout.customerAddress.zipcodeLabel')"
        :placeholder="$t('checkout.customerAddress.zipcodePlaceholder')"
        :errorMessage="errorMessages?.value?.zipcode?.$errors?.[0] ?? ''"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.city"
        id="city"
        data-testid="checkout-pi-city-input"
        :label="$t('checkout.customerAddress.cityLabel')"
        :placeholder="$t('checkout.customerAddress.cityPlaceholder')"
        :errorMessage="errorMessages?.value?.city?.$errors?.[0] ?? ''"
      />
    </div>
    <div>
      <FormCountrySearchSelect
        id="country"
        v-model="state.countryId"
        :label="$t('checkout.customerAddress.countryLabel')"
        :placeholder="$t('checkout.customerAddress.countryPlaceholder')"
        :errorMessage="errorMessages?.value?.countryId?.$errors?.[0] ?? ''"
      />
    </div>
  </form>
</template>
