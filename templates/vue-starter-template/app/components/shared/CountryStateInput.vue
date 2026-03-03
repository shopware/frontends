<script lang="ts" setup>
import type { RegleFieldStatus } from "@regle/core";

const countryId = defineModel<string>("countryId", {
  required: true,
});
const stateId = defineModel<string>("stateId", {
  required: true,
});

const { countryIdValidation = undefined, stateIdValidation = undefined } =
  defineProps<{
    countryIdValidation?: RegleFieldStatus;
    stateIdValidation?: RegleFieldStatus;
  }>();

const { getStatesForCountry, getCountriesOptions } = useCountries();

const states = computed(() => getStatesForCountry(countryId.value || ""));

const stateOptions = computed(() =>
  (states.value ?? []).map((state) => ({
    label: state.translated?.name ?? state.name ?? "",
    value: state.id,
  })),
);

watch(countryId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    stateId.value = "";
  }
});
</script>

<template>
  <div class="flex gap-6">
    <FormDropdownField
      autocomplete="country-name"
      class="w-full"
      id="country"
      v-model="countryId"
      :label="$t('form.country')"
      :options="getCountriesOptions"
      data-testid="country-select"
      :errorMessage="countryIdValidation?.$errors[0]"
    />

    <FormDropdownField
      v-if="states?.length"
      id="state"
      v-model="stateId"
      class="w-full"
      autocomplete="off"
      :placeholder="$t('form.chooseState')"
      :label="$t('form.state')"
      :options="stateOptions"
      data-testid="checkout-pi-state-input"
      :errorMessage="stateIdValidation?.$errors[0]"
    />
  </div>
</template>
