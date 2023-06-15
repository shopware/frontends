<script lang="ts" setup>
const emit = defineEmits<{
  (e: "update:countryId", value: string): void;
  (e: "update:stateId", value: string): void;
}>();

const props = withDefaults(
  defineProps<{
    countryId: string;
    stateId: string;
  }>(),
  {
    countryId: "",
    stateId: "",
  }
);

const localCountry = ref(props.stateId);
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

<!-- @input="$emit('update:email', $event.target.value)" -->

<template>
  <div class="flex gap-6">
    <div>
      <label for="country" class="block text-sm font-medium text-gray-700">{{
        $t("form.country")
      }}</label>
      <select
        id="country"
        required
        name="country"
        autocomplete="country-name"
        class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
        data-testid="checkout-pi-country-input"
        @change="handleCountryUpdate"
      >
        <!-- @blur="$v.billingAddress.countryId.$touch()" -->
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
      <!-- <span
        v-if="$v.billingAddress.countryId.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ $v.billingAddress.countryId.$errors[0].$message }}
      </span> -->
    </div>
    <div v-if="states">
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
      >
        <!-- @blur="$v.billingAddress.stateId.$touch()" -->
        <option disabled selected value="">
          {{ $t("form.chooseState") }}
        </option>

        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.name }}
        </option>
      </select>
      <!-- <span
        v-if="$v.billingAddress.countryId.$error"
        class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
      >
        {{ $v.billingAddress.countryId.$errors[0].$message }}
      </span> -->
    </div>
  </div>
</template>
