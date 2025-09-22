<script setup lang="ts">
import { Validation } from "@vuelidate/core";

const AccountType = {
  private: "private",
  business: "business",
};

type AccountTypeUnion = (typeof AccountType)[keyof typeof AccountType];

// const state = ref({
//   firstName: "",
//   lastName: "",
//   salutationId: "",
//   title: "",
//   accountType: AccountType.private,
//   company: "",
//   vatIds: "",
// });
const state = defineModel<{
  firstName: string;
  lastName: string;
  salutationId: string;
  title: string;
  accountType: AccountTypeUnion;
  company: string;
  vatIds: string;
}>({
  required: true,
});

const emit = defineEmits<{
  submit: [];
}>();

const { $v } = defineProps<{
  validation: Ref<Validation>;
}>();

const handleSubmit = () => {
  emit("submit");
};
</script>
<template>
  <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
    <div class="w-[240px]">
      <FormSalutationSelect v-model="state.salutationId" />
    </div>
    <div class="w-[240px]">
      <FormAccountTypeSelect v-model="state.accountType" />
    </div>
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

    <div class="flex gap-2" v-if="state.accountType === AccountType.business">
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
    <FormBaseButton type="submit"> bla bla </FormBaseButton>
  </form>
</template>
