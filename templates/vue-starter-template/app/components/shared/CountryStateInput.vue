<script lang="ts" setup>
import type { RegleFieldStatus } from "@regle/core";

import type { Schemas } from "#shopware";

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

const emit = defineEmits<{
  "states-change": [states: Schemas["CountryState"][]];
}>();

const states = ref<Schemas["CountryState"][]>([]);

const stateOptions = computed(() =>
  (states.value ?? []).map((state) => ({
    label: state.translated?.name ?? state.name ?? "",
    value: state.id,
  })),
);

function handleStatesChange(countryStates: Schemas["CountryState"][]) {
  states.value = countryStates;
  emit("states-change", countryStates);
}

watch(countryId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    stateId.value = "";
  }
});
</script>

<template>
  <div class="flex gap-6">
    <FormCountrySearchSelect
      class="w-full"
      id="country"
      v-model="countryId"
      :label="$t('form.country')"
      :placeholder="$t('form.chooseCountry')"
      data-testid="country-select"
      :errorMessage="countryIdValidation?.$errors[0]"
      @states-change="handleStatesChange"
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
