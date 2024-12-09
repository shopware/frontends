<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

const { apiClient } = useShopwareContext();
const { refreshSessionContext } = useSessionContext();
const { pushSuccess, pushError } = useNotifications();
const { query } = useRoute();
const router = useRouter();
const { t } = useI18n();
const hash = query.hash;
const em = query.em;
const alreadyConfirmedError = ref(false);

onMounted(async () => {
  try {
    await apiClient.invoke("registerConfirm post /account/register-confirm", {
      body: {
        hash: hash as string,
        em: em as string,
      },
    });
    await refreshSessionContext();
    pushSuccess(t("account.messages.loggedInSuccess"));
    router.push({ path: "/" });
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (
        error.details.errors[0].code ===
        "CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED"
      ) {
        alreadyConfirmedError.value = true;
      } else {
        for (const singleError of error.details.errors) {
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
  <div class="flex justify-center items-center my-20">
    <div v-if="!alreadyConfirmedError" class="flex flex-row items-center">
      <p class="text-15">{{ $t("account.messages.verifying") }}</p>
      <div
        class="ml-10 size-15 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000"
      />
    </div>
    <div v-else class="text-red flex items-center gap-5">
      <div class="w-10 h-10 i-carbon-error" />
      <p class="text-xl">
        {{ $t("errors.CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED") }}
      </p>
    </div>
  </div>
</template>
