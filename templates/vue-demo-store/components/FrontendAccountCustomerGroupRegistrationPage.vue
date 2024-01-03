<script setup lang="ts">
const props = defineProps<{
  navigationId: string;
}>();

const { apiClient } = useShopwareContext();

const { data: registrationResponse } = await useAsyncData(
  "cmsNavigation" + props.navigationId,
  async () => {
    const response = await apiClient.invoke(
      "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}",
      {
        customerGroupId: props.navigationId,
      },
    );
    return response || {};
  },
);
</script>

<template>
  <div class="container mx-auto bg-white flex flex-col">
    <h1
      class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-secondary-900 md:text-3xl lg:text-5xl dark:text-white text-center"
    >
      {{ registrationResponse?.translated.registrationTitle }}
    </h1>
    <div
      v-if="registrationResponse?.registrationActive"
      class="text-lg font-normal text-secondary-500 lg:text-xl dark:text-secondary-400y-400"
    >
      <p class="px-6 sm:px-4 mb-6">
        {{ registrationResponse?.translated?.registrationIntroduction }}
      </p>
      <AccountRegisterForm :customer-group-id="registrationResponse?.id" />
    </div>
    <div
      v-else
      class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-secondary-800 dark:text-yellow-300"
      role="alert"
    >
      <span class="font-medium">Registration is not active!</span> Try again
      later or contact us.
    </div>
  </div>
</template>
