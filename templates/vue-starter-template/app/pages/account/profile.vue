<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useVuelidate } from "@vuelidate/core";
import personalDataFormRules from "../../utils/validation/rules/personalDataFormRules";

const { user, refreshUser, updatePersonalInfo } = useUser();

const state = ref({
  firstName: "",
  lastName: "",
  salutationId: "",
  title: "",
  accountType: "",
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

const $v = useVuelidate(personalDataFormRules(state.accountType), state);

async function handleSubmit() {
  await $v.value.$validate();
  if ($v.value.$invalid) {
    return;
  }

  // await updatePersonalInfo(state.value);
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
          :validation="$v"
          @submit="handleSubmit"
        />
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
