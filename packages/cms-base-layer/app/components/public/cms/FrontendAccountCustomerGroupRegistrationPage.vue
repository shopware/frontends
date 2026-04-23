<script setup lang="ts">
const props = defineProps<{
  navigationId: string;
}>();

const { apiClient } = useShopwareContext();

const { data: registrationResponse } = await useAsyncData(
  `cmsNavigation${props.navigationId}`,
  async () => {
    const response = await apiClient.invoke(
      "getCustomerGroupRegistrationInfo get /customer-group-registration/config/{customerGroupId}",
      {
        pathParams: { customerGroupId: props.navigationId },
      },
    );
    return response.data || {};
  },
);

useSeoMeta({
  description: () =>
    registrationResponse.value?.translated?.registrationSeoMetaDescription ||
    undefined,
});
</script>

<template>
  <div class="container mx-auto bg-surface-surface flex flex-col mt-10">
    <h1
      class="mb-4 text-2xl font-extrabold leading-none tracking-tight text-surface-on-surface md:text-3xl lg:text-5xl text-center"
    >
      {{ registrationResponse?.translated.registrationTitle }}
    </h1>
    <div
      v-if="registrationResponse?.registrationActive"
      class="text-lg font-normal text-surface-on-surface-variant lg:text-xl"
    >
      <div
        v-if="registrationResponse.translated.registrationIntroduction"
        class="px-6 sm:px-4 mb-6"
        v-html="registrationResponse?.translated.registrationIntroduction"
      />
      <AccountRegistrationForm
        :customer-group-id="registrationResponse?.id"
        :company-only="
          registrationResponse?.translated?.registrationOnlyCompanyRegistration
        "
      />
    </div>
  </div>
</template>
