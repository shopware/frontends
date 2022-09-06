<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
definePageMeta({
  layout: "account",
});

const modal = inject<SharedModal>("modal") as SharedModal;
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const { customerAddresses, loadCustomerAddresses } = useAddress();

await useAsyncData("getCustomerAddresses", () => {
  return loadCustomerAddresses();
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
      <AccountAddressCard
        v-for="address in customerAddresses"
        :key="address.id"
        :address="address"
        :countries="getCountries"
        :salutations="getSalutations"
      />
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
