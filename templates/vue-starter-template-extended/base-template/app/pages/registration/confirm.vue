<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { pushSuccess, pushError } = useNotifications();
const { query } = useRoute();
const router = useRouter();
const { t } = useI18n();
const hash = Array.isArray(query.hash) ? query.hash[0] : query.hash;
const em = Array.isArray(query.em) ? query.em[0] : query.em;
const alreadyConfirmedError = ref(false);
onMounted(async () => {
  if (typeof hash !== "string" || typeof em !== "string" || !hash || !em) {
    pushError(t("account.messages.verificationLinkInvalid"));
    router.push({ path: "/" });
    return;
  }
  try {
    await apiClient.invoke("registerConfirm post /account/register-confirm", {
      body: {
        hash,
        em,
      },
    });
    await refreshSessionContext();
    pushSuccess(t("account.messages.loggedInSuccess"));
    router.push({ path: "/" });
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = error.details?.errors;
      if (!Array.isArray(errors) || errors.length === 0) {
        return;
      }
      if (errors[0]?.code === "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED") {
        alreadyConfirmedError.value = true;
      } else {
        for (const singleError of errors) {
          if (singleError?.detail) {
            pushError(singleError.detail);
          }
        }
      }
    }
  }
});
</script>
<template>
  <div class="flex justify-center items-center min-h-[60vh] px-4">
    <div v-if="!alreadyConfirmedError" class="flex flex-row items-center gap-3">
      <p class="text-base text-surface-on-surface">
        {{ $t("account.messages.verifying") }}
      </p>
      <div
        class="size-5 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000 text-brand-primary"
      />
    </div>
    <div v-else class="flex flex-col items-center gap-4 max-w-md text-center">
      <div class="size-12 i-carbon-error text-states-error" />
      <p class="text-lg font-medium text-states-error">
        {{ $t("errors.CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED") }}
      </p>
    </div>
  </div>
</template>
