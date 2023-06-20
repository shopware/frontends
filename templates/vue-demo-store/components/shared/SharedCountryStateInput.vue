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

const localCountry = ref(props.countryId);
const localState = ref(props.stateId);

const { getCountries, getStatesForCountry } = useCountries();

const states = computed(() => {
  return getStatesForCountry(localCountry.value);
});

const handleCountryUpdate = (e: Event) => {
  const target = e.target as HTMLInputElement;
  localCountry.value = target.value;
  localState.value = "";
  emit("update:stateId", "");
  emit("update:countryId", target.value);
};

const handleStateUpdate = (e: Event) => {
  const target = e.target as HTMLInputElement;
  localState.value = target.value;
  emit("update:stateId", target.value);
};
</script>

<template>
  <div class="flex gap-6">
    <div class="w-full">
      <label for="country" class="block text-sm font-medium text-gray-700">{{
        $t("form.country")
      }}</label>
      <select
        id="country"
        v-model="localCountry"
        required
        name="country"
        autocomplete="country-name"
        class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
        data-testid="country-select"
        @change="handleCountryUpdate"
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
        v-model="localState"
        required
        name="state"
        autocomplete="state-name"
        class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
        data-testid="checkout-pi-state-input"
        @change="handleStateUpdate"
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
