<script lang="ts" setup>
import type { MaybeRef } from "vue";

const model = defineModel<string>({
  required: true,
});

const {
  id = "",
  dataTestId = "",
  errorMessage = undefined,
} = defineProps<{
  id?: string;
  dataTestId?: string;
  errorMessage?: MaybeRef<string>;
}>();

const nuxtApp = useNuxtApp();
const { apiClient } = useShopwareContext();
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

const isLoading = computed(() => unref(status) === "pending");
const errorMessageText = computed(() => (error ? error : errorMessage));
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
  <small v-if="errorMessageText" class="text-states-error">{{
    errorMessageText
  }}</small>
</template>
