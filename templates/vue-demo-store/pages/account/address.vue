<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
definePageMeta({
  layout: "account",
});
const loadingData = ref(true);
const modal = inject<SharedModal>("modal") as SharedModal;
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const { customerAddresses, loadCustomerAddresses } = useAddress();

onBeforeMount(async () => {
  await loadCustomerAddresses();
  loadingData.value = false;
});
</script>

<template>
  <div class="container mx-auto my-8">
    <div class="contents text-2xl font-medium text-gray-900">
      <h1 class="border-b pb-3">Addresses</h1>
    </div>
    <p class="text-sm text-gray-500 mt-3">
      View your current default addresses or add new ones.
    </p>
    <div class="grid grid-cols-6 gap-12 mt-8">
      <div v-if="loadingData" class="col-span-6 lg:col-span-3 max-w-md">
        <div class="flex mb-2 space-x-2">
          <div class="w-36 bg-gray-300 h-6 rounded-md" />
          <div class="w-6 bg-gray-300 h-6 rounded-md" />
        </div>

        <div class="w-36 bg-gray-300 h-4 rounded-md mb-2" />
        <div class="w-36 bg-gray-300 h-4 rounded-md mb-2" />
        <div class="w-36 bg-gray-300 h-4 rounded-md" />
      </div>
      <template v-else>
        <AccountAddressCard
          v-for="address in customerAddresses"
          :can-delete="true"
          :key="address.id"
          :address="address"
          :countries="getCountries"
          :salutations="getSalutations"
        />
      </template>
    </div>
    <button
      class="group relative justify-center py-2 px-4 my-8 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
      type="submit"
      @click="
        modal.open('AccountAddressForm', {
          countries: getCountries,
          salutations: getSalutations,
        })
      "
    >
      Add new address
    </button>
  </div>
</template>
