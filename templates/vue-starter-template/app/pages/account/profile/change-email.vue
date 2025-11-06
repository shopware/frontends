<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";
import type { operations } from "#shopware";

const { apiClient } = useShopwareContext();
const { pushSuccess } = useNotifications();
const router = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { handleApiError } = useApiErrorsResolver("account_change_email_form");

const state = ref<operations["changeEmail post /account/change-email"]["body"]>(
  {
    email: "",
    emailConfirmation: "",
    password: "",
  },
);

const $v = useVuelidate(changeEmailFormRules(state), state);

async function handleSubmit() {
  await $v.value.$validate();
  if ($v.value.$invalid) {
    return;
  }

  try {
    await apiClient.invoke("changeEmail post /account/change-email", {
      body: {
        email: state.value.email,
        emailConfirmation: state.value.emailConfirmation,
        password: state.value.password,
      },
    });

    pushSuccess($t("account.changeEmail.form.successUpdate"));
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
        :title="$t('account.changeEmail.header')"
      />

      <AccountSectionHeader
        class="mb-8"
        :title="$t('account.changeEmail.subHeader')"
      />

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-md">
        <FormInputField
          id="newEmail"
          v-model="state.email"
          type="email"
          :label="$t('account.changeEmail.form.newEmailLabel')"
          :errorMessage="$v.email.$errors[0]?.$message"
          autocomplete="off"
        />

        <FormInputField
          id="confirmEmail"
          v-model="state.emailConfirmation"
          type="email"
          :label="$t('account.changeEmail.form.confirmEmailLabel')"
          :errorMessage="$v.emailConfirmation.$errors[0]?.$message"
          autocomplete="off"
        />

        <FormInputField
          id="password"
          v-model="state.password"
          type="password"
          :label="$t('account.changeEmail.form.passwordLabel')"
          :errorMessage="$v.password.$errors[0]?.$message"
          autocomplete="current-password"
        />

        <div>
          <FormBaseButton
            :label="$t('account.changeEmail.form.buttonSubmit')"
            type="submit"
          />
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>
