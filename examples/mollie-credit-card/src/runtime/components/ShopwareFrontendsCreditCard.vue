<script setup lang="ts">
import {
  useShopwareContext,
  useUser,
} from "@shopware-pwa/composables-next/dist";
const { apiInstance } = useShopwareContext();
const { user } = useUser();
import type { MollieLocale } from "../../types";

defineProps<{
  locale?: MollieLocale;
  submitButtonLabel?: string;
  submitDisabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "submit", token: string | undefined): void;
  (e: "error", error: string | undefined): void;
}>();

const onCreditCardSubmit = async (token: string | undefined) => {
  apiInstance.invoke.post(
    `/store-api/script/mollie/creditcard/store-token/${user.value?.id}/${token}`,
    {},
  );
  emits("submit", token);
};

const onCreditCardError = async (error: string | undefined) => {
  emits("error", error);
};
</script>
<template>
  <MollieCreditCardComponent
    :locale="locale"
    :submit-button-label="submitButtonLabel"
    :submit-disabled="submitDisabled"
    @submit="onCreditCardSubmit"
    @error="onCreditCardError"
  />
</template>
