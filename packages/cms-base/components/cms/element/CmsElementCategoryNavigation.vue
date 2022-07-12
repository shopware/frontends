<script setup>
import { getCategoryUrl, getTranslatedProperty } from "@shopware-pwa/helpers";
import { getStoreNavigation } from "@shopware-pwa/shopware-6-client";
import { useCms, useShopwareContext } from "@shopware-pwa/composables-next";

const { apiInstance } = useShopwareContext();
const { resourceIdentifier } = useCms();
const navigationElements = ref([]);

onMounted(async () => {
  try {
    if (!resourceIdentifier.value) return;
    const response = await getStoreNavigation(
      {
        requestActiveId: resourceIdentifier.value,
        requestRootId: resourceIdentifier.value,
      },
      apiInstance
    );
    navigationElements.value = response;
  } catch (error) {
    console.warn(
      "CmsElementCategoryNavigation:onMounted:getStoreNavigation",
      error.messages
    );
  }
});
</script>
<template>
  <div
    v-if="navigationElements.length"
    class="container mx-auto overflow-y-auto mt-8 py-4 px-3 bg-gray-50 rounded dark:bg-gray-800"
  >
    <ul class="space-y-2">
      <li v-for="(navigationElement, index) in navigationElements" :key="index">
        <router-link
          :to="getCategoryUrl(navigationElement)"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span class="ml-3">{{
            getTranslatedProperty(navigationElement, "name")
          }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
