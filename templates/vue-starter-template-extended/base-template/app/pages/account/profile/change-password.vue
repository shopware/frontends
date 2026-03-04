<script setup lang="ts">
import { useRegle } from "@regle/core";
import type { operations } from "#shopware";

const { apiClient } = useShopwareContext();
const { pushSuccess } = useNotifications();
const router = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { handleApiError } = useApiErrorsResolver("account_change_password_form");

const state = ref<
  operations["changePassword post /account/change-password"]["body"]
>({
  newPassword: "",
  newPasswordConfirm: "",
  password: "",
});

const { r$ } = useRegle(state, changePasswordFormRules(state));

async function handleSubmit() {
  await r$.$validate();
  if (r$.$invalid) {
    return;
  }

  try {
    await apiClient.invoke("changePassword post /account/change-password", {
      body: {
        newPassword: state.value.newPassword,
        newPasswordConfirm: state.value.newPasswordConfirm,
        password: state.value.password,
      },
    });

    pushSuccess($t("account.changePassword.form.successUpdate"));
    await router.push(formatLink("/account/profile"));
  } catch (error) {
    handleApiError(error);
  }
}
</script>

<template>
  <NuxtLayout name="account">
    <div class="mb-10">
      <NuxtLink
        class="text-sm inline-flex items-center gap-1 text-brand-primary bg-none bg-transparent"
        :to="formatLink('/account/profile')"
      >
        < {{ $t("account.back") }}
      </NuxtLink>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.changePassword.header')"
      />

      <AccountSectionHeader
        class="mb-8"
        :title="$t('account.changePassword.subHeader')"
      />

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-md">
        <FormInputField
          id="newPassword"
          v-model="state.newPassword"
          type="password"
          :label="$t('account.changePassword.form.newPasswordLabel')"
          :errorMessage="r$.newPassword.$errors[0]"
          autocomplete="new-password"
        />

        <FormInputField
          id="newPasswordConfirm"
          v-model="state.newPasswordConfirm"
          type="password"
          :label="$t('account.changePassword.form.confirmPasswordLabel')"
          :errorMessage="r$.newPasswordConfirm.$errors[0]"
          autocomplete="new-password"
        />

        <FormInputField
          id="currentPassword"
          v-model="state.password"
          type="password"
          :label="$t('account.changePassword.form.currentPasswordLabel')"
          :errorMessage="r$.password.$errors[0]"
          autocomplete="current-password"
        />

        <div>
          <FormBaseButton
            :label="$t('account.changePassword.form.buttonSubmit')"
            type="submit"
          />
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>
