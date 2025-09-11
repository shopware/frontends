<script lang="ts" setup>
const model = defineModel<string>({
  required: true,
});

const {
  id = "",
  dataTestId = "",
  loading = false,
} = defineProps<{
  id?: string;
  dataTestId?: string;
  loading?: boolean;
}>();

const { apiClient } = useShopwareContext();
const nuxtApp = useNuxtApp();

const { data: salutationData } = await useAsyncData(
  "salutationData",
  () => apiClient.invoke("readSalutation post /salutation"),
  {
    transform: (data) => {
      return data.data.elements.map((element) => ({
        label: element.displayName,
        value: element.id,
      }));
    },
    getCachedData: (data) => {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

console.log("result", salutationData.value.data);
</script>
<template>
  <pre>
 {{ salutationData }}

    </pre
  >

  <FormDropdownField
    :id="id"
    v-model="model"
    :label="$t('form.salutation.title')"
    :options="salutationOptions"
    :data-testid="dataTestId"
    :loading
  />
</template>
