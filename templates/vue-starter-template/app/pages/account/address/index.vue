<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const { user, defaultBillingAddressId, defaultShippingAddressId, refreshUser } =
  useUser();
const { resolveApiErrors } = useApiErrorsResolver("account_addresses");
const { pushError } = useNotifications();

const {
  customerAddresses,
  loadCustomerAddresses,
  deleteCustomerAddress,
  setDefaultCustomerBillingAddress,
  setDefaultCustomerShippingAddress,
} = useAddress();

const deletingAddresses = ref<Set<string>>(new Set());

function handleAddAddress() {
  navigateTo("/account/address/new");
}

function handleEditAddress(addressId: string) {
  navigateTo(`/account/address/edit/${addressId}`);
}

async function handleDeleteAddress(addressId: string) {
  deletingAddresses.value.add(addressId);

  try {
    // TODO: change it after the API is updated
    await deleteCustomerAddress(addressId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await loadCustomerAddresses();
    await refreshUser();
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      for (const error of errors) {
        pushError(error);
      }
    }
  } finally {
    deletingAddresses.value.delete(addressId);
  }
}

async function handleSetAsDefaultBillingAddress(addressId: string) {
  try {
    // TODO: change it after the API is updated
    await setDefaultCustomerBillingAddress(addressId);
    await loadCustomerAddresses();
    await refreshUser();
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      for (const error of errors) {
        pushError(error);
      }
    }
  }
}

async function handleSetAsDefaultShippingAddress(addressId: string) {
  try {
    // TODO: change it after the API is updated
    await setDefaultCustomerShippingAddress(addressId);
    await loadCustomerAddresses();
    await refreshUser();
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      for (const error of errors) {
        pushError(error);
      }
    }
  }
}

onBeforeMount(async () => {
  await loadCustomerAddresses();
});
</script>

<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.address.header')"
        :subtitle="$t('account.address.subHeader')"
      />

      <FormBaseButton
        class="mb-14"
        variant="secondary"
        @click="handleAddAddress"
      >
        + {{ $t("account.address.addAddressButton") }}</FormBaseButton
      >

      <div class="block md:flex gap-10 mb-10">
        <div class="flex-1 mb-10">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.address.defaultBillingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultBillingAddress"
            :address="user.defaultBillingAddress"
          />
        </div>

        <div class="flex-1 mb-10">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.address.defaultShippingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultShippingAddress"
            :address="user.defaultShippingAddress"
          />
        </div>
      </div>

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.address.availableAddressesSectionHeader')"
        />

        <TransitionGroup
          class="block md:grid grid-cols-2 gap-10"
          name="addresses"
          tag="div"
        >
          <AccountAddressTile
            v-for="address in customerAddresses"
            :key="address.id"
            :address
            :is-deleting="deletingAddresses.has(address.id)"
            :is-default-billing-address="address.id === defaultBillingAddressId"
            :is-default-shipping-address="
              address.id === defaultShippingAddressId
            "
            @delete="handleDeleteAddress"
            @edit="handleEditAddress"
            @set-as-default-billing-address="handleSetAsDefaultBillingAddress"
            @set-as-default-shipping-address="handleSetAsDefaultShippingAddress"
          />
        </TransitionGroup>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.addresses-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.addresses-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.addresses-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.addresses-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8) rotate(5deg);
  filter: blur(2px);
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.addresses-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.addresses-enter-active,
.addresses-leave-active,
.addresses-move {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
