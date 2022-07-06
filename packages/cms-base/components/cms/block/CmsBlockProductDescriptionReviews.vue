<script setup lang="ts">
import { CmsBlock, ProductReview } from "@shopware-pwa/commons";
import { getTranslatedProperty } from "@shopware-pwa/helpers";
import { getProductReviews } from "@shopware-pwa/shopware-6-client";
import { Ref } from "vue";

const props = defineProps<{
  content: CmsBlock;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const slotContent = getSlotContent("product-description-reviews");

const { cmsContent } = useCms();
const product = computed(
  () => slotContent?.data?.product || cmsContent.value?.product
);

const description = computed(() =>
  getTranslatedProperty(product.value, "description")
);
const properties = computed(() => product.value?.properties || []);
const reviews: Ref<ProductReview[]> = ref([]);

const { apiInstance } = useShopwareContext();
onMounted(async () => {
  const reviewsResponse = await getProductReviews(
    product.value?.id,
    undefined,
    apiInstance
  );
  reviews.value = reviewsResponse?.elements || [];
});
</script>

<template>
  <div class="container mx-auto mb-8">
    <!-- Description and details -->
    <div v-if="description">
      <h3 class="text-sm font-medium text-gray-900">Description</h3>
      <div class="mt-4 space-y-6">
        <p class="text-base text-gray-900" v-html="description"></p>
      </div>
    </div>

    <div class="mt-10" v-if="properties?.length">
      <h3 class="text-sm font-medium text-gray-900">Properties</h3>

      <div class="mt-4">
        <ul role="list" class="pl-4 list-disc text-sm space-y-2">
          <li
            v-for="property in properties"
            :key="property.id"
            class="text-gray-400"
          >
            <span class="text-gray-600">{{
              getTranslatedProperty(property, "name")
            }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-10" v-if="reviews?.length">
      <h3 class="text-sm font-medium text-gray-900">Reviews</h3>
      <div class="mt-4" v-if="reviews?.length">
        <ul role="list" class="pl-4 list-disc text-sm space-y-2">
          <li v-for="review in reviews" :key="review.id" class="text-gray-400">
            <span class="text-gray-600">{{ review.content }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
