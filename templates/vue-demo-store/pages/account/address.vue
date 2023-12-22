<script lang="ts">
export default {
  name: "AccountAddressPage",
};
</script>

<script setup lang="ts">
definePageMeta({
  layout: "account",
});
const loadingData = ref(true);
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const { customerAddresses, loadCustomerAddresses } = useAddress();
const { t } = useI18n();

const addAddressModalController = useModal();

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
  {
    name: t("breadcrumbs.address"),
    path: "/account/address",
  },
]);

const refreshAddresses = async () => {
  loadingData.value = true;
  await loadCustomerAddresses();
  loadingData.value = false;
};

onBeforeMount(async () => {
  await loadCustomerAddresses();
  loadingData.value = false;
});
</script>

<template>
  <div class="container mx-auto my-8">
    <div class="contents text-2xl font-medium text-secondary-900">
      <h1 class="border-b pb-3">{{ $t("account.addresses") }}</h1>
    </div>
    <p class="text-sm text-secondary-500 mt-3">
      {{ $t("account.addressesLabel") }}
    </p>
    <div class="grid grid-cols-6 gap-12 mt-8">
      <div v-if="loadingData" class="col-span-6 lg:col-span-3 max-w-md">
        <div class="flex mb-2 space-x-2">
          <div class="w-36 bg-secondary-300 h-6 rounded-md" />
          <div class="w-6 bg-secondary-300 h-6 rounded-md" />
        </div>

        <div class="w-36 bg-secondary-300 h-4 rounded-md mb-2" />
        <div class="w-36 bg-secondary-300 h-4 rounded-md mb-2" />
        <div class="w-36 bg-secondary-300 h-4 rounded-md" />
      </div>
      <template v-else>
        <AccountAddressCard
          v-for="address in customerAddresses"
          :key="address.id"
          :can-delete="true"
          :address="address"
          :countries="getCountries"
          :salutations="getSalutations"
          @success="refreshAddresses"
        />
      </template>
    </div>
    <button
      class="group relative justify-center py-2 px-4 my-8 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
      type="submit"
      data-testid="addresses-add-button"
      @click="addAddressModalController.open"
    >
      {{ $t("account.addressAddNew") }}
    </button>
    <SharedModal :controller="addAddressModalController">
      <SharedAccountAddressForm
        @success="
          async () =>
            await refreshAddresses().then(addAddressModalController.close)
        "
      />
    </SharedModal>
  </div>
</template>
