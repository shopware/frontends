<script setup lang="ts">
const { email } = defineProps<{
  email: string;
}>();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <div class="flex-col lg:flex-row flex gap-4">
    <div class="flex-grow">{{ email }}</div>
    <NuxtLink
      :to="formatLink('/account/profile/change-email')"
      class="leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent"
    >
      <Icon name="shopware:envelope" />
      {{ $t("account.profile.changeEmailButton") }}
    </NuxtLink>
    <NuxtLink
      :to="formatLink('/account/profile/change-password')"
      class="leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent"
    >
      <Icon name="shopware:key" />
      {{ $t("account.profile.changePasswordButton") }}
    </NuxtLink>
  </div>
</template>
