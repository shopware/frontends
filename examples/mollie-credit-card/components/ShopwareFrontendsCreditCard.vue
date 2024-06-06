<script setup lang="ts">
const { apiClient } = useShopwareContext();
const { user } = useUser();
import type { MollieLocale } from "@/types";

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
  apiClient.invoke(
    "mollieSubmitCreditCart post script/mollie/creditcard/store-token/{userId/{token}",
    {
      pathParams: {
        userId: user.value!.id!,
        token: token!,
      },
    },
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
