<script setup lang="ts">
import { useRegle } from "@regle/core";
import { onBeforeMount } from "vue";

const { user, updatePersonalInfo } = useUser();
const { pushSuccess } = useNotifications();
const { handleApiError } = useApiErrorsResolver("account_profile_form");

type AccountType = "private" | "business";

const state = ref({
  firstName: "",
  lastName: "",
  salutationId: "",
  title: "",
  accountType: "private" as AccountType,
  company: "",
  vatIds: "",
});

onBeforeMount(() => {
  state.value.firstName = user.value?.firstName || "";
  state.value.lastName = user.value?.lastName || "";
  state.value.salutationId = user.value?.salutationId || "";
  state.value.title = user.value?.title || "";
  state.value.accountType = user.value?.accountType || "private";

  if (user.value?.accountType === "business") {
    state.value.vatIds = user.value?.vatIds[0] || "";
    state.value.company = user.value?.company || "";
  }
});

const { r$ } = useRegle(
  state,
  personalDataFormRules(computed(() => state.value.accountType)),
);

async function handleSubmit() {
  await r$.$validate();
  if (r$.$invalid) {
    return;
  }

  try {
    const {
      firstName,
      lastName,
      salutationId,
      title,
      accountType,
      company,
      vatIds,
    } = state.value;
    const basePayload = { firstName, lastName, salutationId, title };

    await updatePersonalInfo(
      accountType === "business"
        ? {
            ...basePayload,
            accountType,
            company: company || "",
            vatIds: vatIds ? [vatIds] : [""],
          }
        : basePayload,
    );
    pushSuccess($t("account.profile.form.successUpdate"));
  } catch (error) {
    handleApiError(error);
  }
}
</script>

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
        <AccountPersonalDataForm
          v-model="state"
          :validation="r$"
          @submit="handleSubmit"
        />
      </div>

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.profile.loginDataSectionHeader')"
        />
        <AccountPersonalLoginData :email="user?.email || ''" />
      </div>
    </div>
  </NuxtLayout>
</template>
