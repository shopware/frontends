<script setup lang="ts">
import type { Regle } from "@regle/core";

import type { Schemas } from "#shopware";

const state = defineModel<
  Omit<Schemas["CustomerAddress"], "id" | "customerId">
>({
  required: true,
});

const { validation } = defineProps<{
  validation?: Regle<
    Omit<Schemas["CustomerAddress"], "id" | "customerId">
  >["r$"];
}>();

const emit = defineEmits<{
  "states-change": [states: Schemas["CountryState"][]];
}>();

const zipcodeModel = computed({
  get: () => state.value.zipcode ?? "",
  set: (value: string) => {
    state.value.zipcode = value;
  },
});

const countryStateIdModel = computed({
  get: () => state.value.countryStateId ?? "",
  set: (value: string) => {
    state.value.countryStateId = value;
  },
});

function handleCountryStatesChange(states: Schemas["CountryState"][]) {
  emit("states-change", states);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.firstName"
        id="first-name"
        autocomplete="given-name"
        :label="$t('checkout.customerAddress.firstNameLabel')"
        :placeholder="$t('checkout.customerAddress.firstNamePlaceholder')"
        :errorMessage="validation?.firstName.$errors[0]"
        @blur="validation?.firstName.$touch()"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.lastName"
        id="last-name"
        autocomplete="family-name"
        :label="$t('checkout.customerAddress.lastNameLabel')"
        :placeholder="$t('checkout.customerAddress.lastNamePlaceholder')"
        :errorMessage="validation?.lastName.$errors[0]"
        @blur="validation?.lastName.$touch()"
      />
    </div>
    <div>
      <FormInputField
        v-model="state.street"
        id="street"
        autocomplete="street-address"
        :label="$t('checkout.customerAddress.streetLabel')"
        :placeholder="$t('checkout.customerAddress.streetPlaceholder')"
        :errorMessage="validation?.street.$errors[0]"
        @blur="validation?.street.$touch()"
      />
    </div>
    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="zipcodeModel"
        id="zipcode"
        autocomplete="postal-code"
        :label="$t('checkout.customerAddress.zipcodeLabel')"
        :placeholder="$t('checkout.customerAddress.zipcodePlaceholder')"
        :errorMessage="validation?.zipcode?.$errors[0]"
        @blur="validation?.zipcode?.$touch()"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.city"
        id="city"
        autocomplete="address-level2"
        :label="$t('checkout.customerAddress.cityLabel')"
        :placeholder="$t('checkout.customerAddress.cityPlaceholder')"
        :errorMessage="validation?.city.$errors[0]"
        @blur="validation?.city.$touch()"
      />
    </div>
    <SharedCountryStateInput
      v-model:country-id="state.countryId"
      v-model:state-id="countryStateIdModel"
      :country-id-validation="validation?.countryId"
      :state-id-validation="validation?.countryStateId"
      @states-change="handleCountryStatesChange"
    />
  </div>
</template>
