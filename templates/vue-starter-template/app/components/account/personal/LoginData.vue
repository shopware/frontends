<script setup lang="ts">
const { email } = defineProps<{
  email: string;
}>();
</script>
<template>
  <div class="flex gap-4">
    <div class="flex-grow">{{ email }}</div>
    <AccountActionLink>
      <Icon name="shopware:envelope" />
      [TODO 2027] {{ $t("account.profile.changeEmailButton") }}
    </AccountActionLink>
    <AccountActionLink>
      <Icon name="shopware:key" />
      [TODO 2027] {{ $t("account.profile.changePasswordButton") }}
    </AccountActionLink>
  </div>
</template>
