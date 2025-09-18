<script setup lang="ts">
const state = ref({
  accountType: null,
  firstName: "",
  lastName: "",
});
</script>
<template>
  <form class="flex flex-col gap-2">
    <FormAccountTypeSelect v-model="state.accountType" />
    <div class="flex gap-2">
      <FormInputField
        class="w-full"
        v-model="state.firstName"
        :label="$t('account.profile.form.firstName')"
      />
      <FormInputField
        class="w-full"
        v-model="state.lastName"
        :label="$t('account.profile.form.lastName')"
      />
    </div>
    <div class="flex gap-2">
      <FormInputField
        class="w-full"
        v-model="state.company"
        :label="$t('account.profile.form.company')"
      />
      <FormInputField
        class="w-full"
        v-model="state.vatIds"
        :label="$t('account.profile.form.vatIds')"
      />
    </div>
  </form>
</template>
