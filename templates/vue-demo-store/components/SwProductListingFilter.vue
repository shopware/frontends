<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import SwFilterPropertiesVue from "./listing-filters/SwFilterProperties.vue";
import SwFilterPriceVue from "./listing-filters/SwFilterPrice.vue";
import SwFilterBrandsVue from "./listing-filters/SwFilterBrands.vue";
import SwFilterColorsVue from "./listing-filters/SwFilterColors.vue";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: "selectFilterValue", { code, value }: { code: any; value: any }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]: any;
  };
}>();

const cmsMap = () => {
  const map: {
    [key: string]: any;
  } = {
    manufacturer: SwFilterBrandsVue,
    color: SwFilterColorsVue,
    properties: SwFilterPropertiesVue,
    price: SwFilterPriceVue,
  };

  if (props.filter?.displayType && map?.[props.filter?.displayType]) {
    return map?.[props.filter?.displayType];
  }

  return map[props.filter?.code];
};
</script>
<template>
  <div>
    <Disclosure
      v-slot="{ open }"
      as="div"
      class="border-t border-t-gray-200 px-4 lg:px-0"
    >
      <DisclosureButton
        class="flex items-center justify-between font-medium py-4 w-full"
      >
        <span class="text-base font-medium capitalize text-gray-700">{{ props.filter?.label }}</span>
        <span class="ml-6 flex items-center">
          <ChevronDownIcon v-if="!open" class="block h-6 w-6 text-gray-900" aria-hidden="true" />
          <ChevronUpIcon v-else class="block h-6 w-6 text-gray-900" aria-hidden="true" />
        </span>
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <DisclosurePanel class="pt-2">
          <component
            :is="cmsMap()"
            :filter="filter"
            :selectedFilters="selectedFilters"
            @select-value="emit('selectFilterValue', $event)"
          />
        </DisclosurePanel>
      </transition>
    </Disclosure>
    
  </div>
</template>
