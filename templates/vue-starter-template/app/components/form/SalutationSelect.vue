<script lang="ts" setup>
const model = defineModel<string>({
  required: true,
});

const { id = "", dataTestId = "" } = defineProps<{
  id?: string;
  dataTestId?: string;
}>();

const { apiClient } = useShopwareContext();
const nuxtApp = useNuxtApp();
const { defaultCSRCacheLifetime } = useAppConfig();
const {
  data: salutationData,
  status,
  error,
} = await useAsyncData(
  "salutationData",
  () => apiClient.invoke("readSalutation post /salutation"),
  {
    transform: (apiData) => {
      const options =
        apiData.data.elements?.map((element) => ({
          label: element.displayName,
          value: element.id,
        })) || [];
      return { options, cachedDate: new Date() };
    },
    getCachedData: (key) => {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];

      // 24 hours cache expiration
      if (
        !data ||
        Date.now() >
          new Date(data.cachedDate).getTime() + defaultCSRCacheLifetime
      )
        return;
      return data;
    },
  },
);

const isLoading = computed(() => status.value === "pending");
</script>
<template>
  <FormDropdownField
    v-bind="$attrs"
    :id="id"
    v-model="model"
    :label="$t('form.salutation')"
    :options="salutationData?.options ?? []"
    :data-testid="dataTestId"
    :loading="isLoading"
  />
  <small v-if="error" class="text-states-error">{{ error }}</small>
</template>
