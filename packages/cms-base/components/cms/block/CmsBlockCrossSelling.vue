<script setup lang="ts">
import {
  CmsBlockCrossSelling,
  CmsElementCrossSelling,
} from "@shopware-pwa/composables-next";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import { CmsProductPageResponse } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsBlockCrossSelling;
}>();

const { cmsContent } = useCms();
const product = computed(
  () => (cmsContent.value as CmsProductPageResponse)?.product
);

const { getSlotContent } = useCmsBlock(props.content);
const slotContent = getSlotContent("content") as CmsElementCrossSelling;

const crossSellCollection = ref(slotContent.data?.crossSellings || []);
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
  } as any);
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
      :key="crossSellItem.id"
    >
      <h3 class="text-sm font-medium text-gray-900">
        {{ getTranslatedProperty(crossSellItem, "name") }}
      </h3>
      <div class="mt-4 flex flex-row">
        <SwProductCard
          :class="`basis-1/4 mx-2`"
          v-for="product in crossSellItem?.assignedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
