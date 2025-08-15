<script lang="ts" setup>
import type { BaseValidation } from "@vuelidate/core";

const countryId = defineModel<string>("countryId", {
  required: true,
});
const stateId = defineModel<string>("stateId", {
  required: true,
});

const { countryIdValidation = undefined, stateIdValidation = undefined } =
  defineProps<{
    countryIdValidation?: BaseValidation;
    stateIdValidation?: BaseValidation;
  }>();

const { getStatesForCountry, getCountriesOptions } = useCountries();

const states = computed(() => getStatesForCountry(countryId.value || ""));

function onCountrySelectChanged() {
  stateId.value = "";
}
</script>

<template>
  <div class="flex gap-6">
    <FormDropdownField
      class="w-full"
      id="country"
      v-model="countryId"
      :label="$t('form.country')"
      :options="getCountriesOptions"
      data-testid="country-select"
      :errorMessage="countryIdValidation.$errors[0]?.$message"
    />

    <div v-if="states && states.length" class="w-full">
      <label for="state" class="block text-sm font-medium text-secondary-700">{{
        $t("form.state")
      }}</label>
      <select
        id="state"
        v-model="stateId"
        required
        name="state"
        autocomplete="off"
        class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
        data-testid="checkout-pi-state-input"
        @blur="stateIdValidation?.$touch()"
      >
        <option disabled selected value="">
          {{ $t("form.chooseState") }}
        </option>

        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.name }}
        </option>
      </select>
      <span
        v-if="stateIdValidation?.$error"
        class="pt-1 text-sm text-red-600 focus:ring-primary border-secondary-300"
      >
        {{ stateIdValidation.$errors[0].$message }}
      </span>
    </div>
  </div>
</template>
