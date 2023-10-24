<script setup lang="ts">
import { invokeGet } from "@shopware-pwa/api-client";
import type { CustomerGroup } from "@shopware-pwa/types";

const props = defineProps<{
  navigationId: string;
}>();

const { apiInstance } = useShopwareContext();

const { data: registrationResponse } = await useAsyncData(
  "cmsNavigation" + props.navigationId,
  async () => {
    const response = await invokeGet<CustomerGroup>(
      {
        address: `/store-api/customer-group-registration/config/${props.navigationId}`,
      },
      apiInstance,
    );
    return response?.data || {};
  },
);
</script>

<template>
  <div class="container mx-auto bg-white flex flex-col">
    <h1
      class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl dark:text-white text-center"
    >
      {{ registrationResponse?.translated.registrationTitle }}
    </h1>
    <div
      v-if="registrationResponse?.registrationActive"
      class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
    >
      <p class="px-6 sm:px-4 mb-6">
        {{ registrationResponse?.translated?.registrationIntroduction }}
      </p>
      <AccountRegisterForm :customer-group-id="registrationResponse?.id" />
    </div>
    <div
      v-else
      class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
      role="alert"
    >
      <span class="font-medium">Registration is not active!</span> Try again
      later or contact us.
    </div>
  </div>
</template>
