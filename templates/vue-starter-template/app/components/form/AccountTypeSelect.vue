<script setup lang="ts">
type AccountType = "private" | "business";

const model = defineModel<AccountType>();

const {
  dataTestId = "",
  id = "",
  errorMessage = undefined,
} = defineProps<{
  dataTestId?: string;
  id?: string;
  errorMessage?: string;
}>();

const { t } = useI18n();

const accountTypeOptions = [
  {
    label: t("form.accountType.private"),
    value: "private" as AccountType,
  },
  {
    label: t("form.accountType.business"),
    value: "business" as AccountType,
  },
];
</script>
<template>
  <FormDropdownField
    :id="id"
    v-model="model"
    :label="$t('form.accountType.title')"
    :options="accountTypeOptions"
    :data-testid="dataTestId"
    :errorMessage="errorMessage"
  />
</template>
