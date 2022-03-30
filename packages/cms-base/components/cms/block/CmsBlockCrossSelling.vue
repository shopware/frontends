<script setup>
import { getTranslatedProperty } from "@shopware-pwa/helpers";
import { useProductAssociations } from "@shopware-pwa/composables"
const cmsPage = inject("cms-page")
const product = computed(() => cmsPage.value?.product)

const {
      loadAssociations: loadCrossSells,
      productAssociations: crossSellCollection,
} = useProductAssociations({
  product: product,
  associationContext: "cross-selling",
})

onMounted(async () => {
  loadCrossSells({
    params: {
      associations: {
        seoUrls: {},
      },
    },
  })
})
</script>

<template>
  <div class="mt-10"  v-if="crossSellCollection?.length">
    <div class="mt-4"
            v-for="crossSellItem in crossSellCollection"
            :key="crossSellItem.crossSelling.id"
    >
      <h3 class="text-sm font-medium text-gray-900">{{getTranslatedProperty(crossSellItem.crossSelling, 'name')}}</h3>
      <div class="mt-4 flex flex-row">
        <SwProductCard :class="`basis-1/4 mx-2`" v-for="product in crossSellItem?.products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>