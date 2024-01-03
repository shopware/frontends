<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

useBreadcrumbs([
  {
    name: t("breadcrumbs.passwordReset"),
    path: "/reset-password",
  },
]);
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="reset-password-wrapper">
    <AccountResetPasswordForm>
      <template #action>
        <NuxtLink
          :to="formatLink(`/`)"
          class="w-full flex justify-center py-2 px-4 border border-primary text-sm font-medium rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {{ $t("returnToHomepage") }}
        </NuxtLink>
      </template>
    </AccountResetPasswordForm>
  </div>
</template>
