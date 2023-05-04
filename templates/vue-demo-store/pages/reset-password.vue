<script lang="ts">
export default {
  name: "ResetPassword",
};
const { t } = useI18n();
useBreadcrumbs([
  {
    name: t("breadcrumbs.passwordReset"),
    path: "/reset-password",
  },
]);
</script>

<template>
  <div class="reset-password-wrapper">
    <AccountResetPasswordForm>
      <template #action>
        <NuxtLink
          to="/"
          class="w-full flex justify-center py-2 px-4 border border-brand-primary text-sm font-medium rounded-md text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {{ $t("returnToHomepage") }}
        </NuxtLink>
      </template>
    </AccountResetPasswordForm>
  </div>
</template>
