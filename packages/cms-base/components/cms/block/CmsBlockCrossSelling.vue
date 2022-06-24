<script setup>
import { getTranslatedProperty } from "@shopware-pwa/helpers";
import { useProductAssociations } from "@shopware-pwa/composables";
const cmsPage = inject("cms-page");
const product = computed(() => cmsPage.value?.product); // || { id: "0099f284cda143558959e6d2803ad20d"})
const $props = defineProps(["content"]);
const crossSellCollection = ref(
  $props.content.slots?.find(({ type }) => type === "cross-selling")?.data
    ?.crossSellings || []
);
const {
  loadAssociations: loadCrossSells,
  productAssociations: crossSellAssociations,
} = useProductAssociations({
  product: product,
  associationContext: "cross-selling",
});
onMounted(async () => {
  if (!product.value) {
    return;
  }
  loadCrossSells({
    params: {
      associations: {
        seoUrls: {},
      },
    },
  });
});

watch(crossSellAssociations, (newCollection) => {
  if (newCollection.length) {
    crossSellCollection.value = newCollection;
  }
});
</script>

<template>
  <div class="container mx-auto mt-8 mb-8" v-if="crossSellCollection?.length">
    <div
      class="mt-4"
      v-for="crossSellItem in crossSellCollection"
      :key="crossSellItem.crossSelling.id"
    >
      <h3 class="text-sm font-medium text-gray-900">
        {{ getTranslatedProperty(crossSellItem.crossSelling, "name") }}
      </h3>
      <div class="mt-4 flex flex-row">
        <SwProductCard
          :class="`basis-1/4 mx-2`"
          v-for="product in crossSellItem?.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
