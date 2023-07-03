<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:countryId", value: string): void;
  (e: "update:stateId", value: string): void;
}>();

const props = withDefaults(
  defineProps<{
    countryId: string;
    stateId: string | null;
    countryIdValidation?: object | null;
    stateIdValidation?: object | null;
  }>(),
  {
    countryId: "",
    stateId: "",
    countryIdValidation: null,
    stateIdValidation: null,
  }
);

const { countryId, stateId } = useVModels(props, emit);
const { getCountries, getStatesForCountry } = useCountries();
const states = computed(() => {
  return getStatesForCountry(countryId.value);
});
function onCountrySelectChanged() {
  stateId.value = "";
}
</script>

<template>
  <div class="flex gap-6">
    <div class="w-full">
      <label for="country" class="block text-sm font-medium text-gray-700">{{
        $t("form.country")
      }}</label>
      <select
        id="country"
        v-model="countryId"
        required
        name="country"
        autocomplete="country-name"
        class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
        data-testid="country-select"
        @change="onCountrySelectChanged"
        @blur="countryIdValidation && countryIdValidation.$touch()"
      >
        <option disabled selected value="">
          {{ $t("form.chooseCountry") }}
        </option>
        <option
          v-for="country in getCountries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.name }}
        </option>
      </select>
      <span
        v-if="countryIdValidation && countryIdValidation.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ countryIdValidation.$errors[0].$message }}
      </span>
    </div>
    <div v-if="states && states.length" class="w-full">
      <label for="state" class="block text-sm font-medium text-gray-700">{{
        $t("form.state")
      }}</label>
      <select
        id="state"
        v-model="stateId"
        required
        name="state"
        autocomplete="state-name"
        class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
        data-testid="checkout-pi-state-input"
        @blur="stateIdValidation && stateIdValidation.$touch()"
      >
        <option disabled selected value="">
          {{ $t("form.chooseState") }}
        </option>

        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.name }}
        </option>
      </select>
      <span
        v-if="stateIdValidation && stateIdValidation.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ stateIdValidation.$errors[0].$message }}
      </span>
    </div>
  </div>
</template>
