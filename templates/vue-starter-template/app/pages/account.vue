<script setup lang="ts">
const {
  user,
  // loadSalutation,
  // userDefaultBillingAddress,
  // userDefaultShippingAddress,
  isLoggedIn,
} = useUser();
</script>
<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.overview.header')"
        :subtitle="$t('account.overview.subHeader')"
      />

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.overview.personalDataSectionHeader')"
        />
        <AccountPersonalDataSection
          :customer-name="user?.firstName + ' ' + user?.lastName"
          :customer-email="user?.email"
        />
      </div>

      <pre>{{ user }}</pre>
      <div class="mb-10">
        <AccountSectionHeader
          :title="$t('account.overview.newsletterSubscriptionSectionHeader')"
        />
      </div>

      <div class="flex gap-10 mb-10">
        <div class="flex-1">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.overview.defaultBillingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultBillingAddress"
            :address="user.defaultBillingAddress"
          />
        </div>

        <div class="flex-1">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.overview.defaultShippingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultShippingAddress"
            :address="user.defaultShippingAddress"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
