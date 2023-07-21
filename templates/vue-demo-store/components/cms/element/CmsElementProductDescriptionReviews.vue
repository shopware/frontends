<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import type { CmsElementProductDescriptionReviews } from "@shopware-pwa/composables-next";
import {
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import {
  getTranslatedProperty,
  getProductName,
} from "@shopware-pwa/helpers-next";
import SwProductReviews from "../../SwProductReviews.vue";

const tabs = ref([
  { name: 'description', href: '#description' },
  { name: 'specification', href: '#specification' },
  { name: 'reviews', href: '#reviews' },
  { name: 'delivery_and_returns', href: '#dar' },
]);

const currentTabHash = ref<string>('#description');
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  content: CmsElementProductDescriptionReviews;
}>();
const { product } = useProduct(props.content.data?.product);

const description = computed(() =>
  getTranslatedProperty(product.value, "description")
);
const reviews = computed(() => props.content.data.reviews?.elements);
const customerReview = computed(() => (props.content.data.reviews as any)?.customerReview);
const ratingMatrix = computed(() => (props.content.data.reviews.aggregations as any)?.ratingMatrix?.buckets);
const changeTab = (hash: string) => {
  router.replace({
    hash,
    query: {
      preventScroll: 1
    },
  });
}

watch(
  () => route.hash,
  hash => {
    if (hash) {
      currentTabHash.value = hash;
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div
    class="cms-element-product-description-reviews flex flex-wrap mt-8 mb-10 sm:my-20 -mx-4 sm:mx-0"
    v-if="product"
  >
    <!-- For mobile -->
    <div class="product-meta sm:hidden w-full">
      <Disclosure as="div" v-for="tab in tabs" :key="tab.name" v-slot="{ open }" :defaultOpen="tab.href === currentTabHash">
        <h3>
          <DisclosureButton class="group relative flex w-full items-center justify-between p-4 text-left border-t border-gray-200">
            <span :class="[open ? 'text-gray-900' : 'text-gray-700', 'text-base font-medium']">{{ $t(tab.name) }}</span>
            <span class="ml-6 flex items-center">
              <ChevronDownIcon v-if="!open" class="block h-6 w-6 text-gray-900" aria-hidden="true" />
              <ChevronUpIcon v-else class="block h-6 w-6 text-gray-900" aria-hidden="true" />
            </span>
          </DisclosureButton>
        </h3>
        <DisclosurePanel as="div" class="prose prose-sm mt-4 mb-8 px-4">
          <div
            :class="[
              'cms-element-product-description-reviews__description',
              tab.href === tabs[0].href ? 'block' : 'hidden',
            ]"
          >
            <p class="text-xl font-bold mt-3">
              {{ getProductName({ product }) }}
            </p>
            <div class="mt-2" v-html="description"></div>
          </div>
          <div
            :class="[
              'cms-element-product-description-reviews__reviews',
              tab.href === tabs[2].href ? 'block' : 'hidden',
            ]"
          >
            <SwProductReviews :product="product" :reviews="reviews" :customerReview="customerReview" :ratingMatrix="ratingMatrix" />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
    <!-- For desktop -->
    <div class="product-meta w-full hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <nuxt-link 
            v-for="tab in tabs" 
            :key="tab.name"
            @click="() => changeTab(tab.href)"
            :class="[currentTabHash === tab.href ? 'border-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']"
            :aria-current="currentTabHash === tab.href ? 'page' : undefined">
              {{ $t(tab.name) }}
          </nuxt-link>
        </nav>
      </div>
    </div>
    <div class="w-full hidden sm:block mt-10">
      <div class="tab-content tab-space">
        <div
          :class="[
            'cms-element-product-description-reviews__description max-w-[640px]',
            currentTabHash !== tabs[0].href ? 'hidden' : 'block',
          ]"
        >
          <p class="text-xl font-bold mt-3">
            {{ getProductName({ product }) }}
          </p>
          <div class="mt-2" v-html="description"></div>
        </div>
        <div
          :class="[
            'cms-element-product-description-reviews__reviews',
            currentTabHash !== tabs[2].href ? 'hidden' : 'block',
          ]"
        >
          <SwProductReviews :product="product" :reviews="reviews" :customerReview="customerReview" :ratingMatrix="ratingMatrix" />
        </div>
      </div>
    </div>
  </div>
</template>
