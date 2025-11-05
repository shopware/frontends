<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";
import type { operations } from "#shopware";

const { apiClient } = useShopwareContext();
const { pushError, pushSuccess } = useNotifications();
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

const $v = useVuelidate(changePasswordFormRules(state), state);

async function handleSubmit() {
  await $v.value.$validate();
  if ($v.value.$invalid) {
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
    handleApiError(error, pushError);
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
          :errorMessage="$v.newPassword.$errors[0]?.$message"
          autocomplete="new-password"
        />

        <FormInputField
          id="newPasswordConfirm"
          v-model="state.newPasswordConfirm"
          type="password"
          :label="$t('account.changePassword.form.confirmPasswordLabel')"
          :errorMessage="$v.newPasswordConfirm.$errors[0]?.$message"
          autocomplete="new-password"
        />

        <FormInputField
          id="currentPassword"
          v-model="state.password"
          type="password"
          :label="$t('account.changePassword.form.currentPasswordLabel')"
          :errorMessage="$v.password.$errors[0]?.$message"
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
