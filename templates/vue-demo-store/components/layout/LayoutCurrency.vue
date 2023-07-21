<script setup lang="ts">
import { useCurrency } from '../../composables/useCurrency';
const attrs = useAttrs();

const { availableCurrencies, currentCurrency, setCurrency } = useCurrency();

const availableCurrenciesOptions = computed(() => {
  return availableCurrencies.value?.map(x => ({
    label: `${x.symbol} ${x.isoCode}`,
    value: x.id
  })) ?? [];
})
</script>
<template>
  <div
    class="sw-currency-switcher"
    data-testid="currency-switcher"
  >
    <SwSelect
      id="currency"
      name="currency"
      :modelValue="currentCurrency?.id"
      @update:modelValue="(e: any) => setCurrency(e)"
      :options="availableCurrenciesOptions"
      v-bind="attrs"
    />
  </div>
</template>
