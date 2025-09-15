<script setup lang="ts">
const { user } = useUser();
function handleAddAddress() {
  console.log("add address");
}
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
      </div>
    </div>
  </NuxtLayout>
</template>
