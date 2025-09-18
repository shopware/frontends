<script setup lang="ts"></script>

<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.profile.header')"
        :subtitle="$t('account.profile.subHeader')"
      />

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.profile.personalDataSectionHeader')"
        />
        <AccountPersonalDataForm />
      </div>

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.profile.loginDataSectionHeader')"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
