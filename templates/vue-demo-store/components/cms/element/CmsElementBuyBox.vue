<script setup lang="ts">
import type { CmsElementBuyBox } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import SharedReviews from '../../shared/SharedReviews.vue';
import {
  getProductName,
  getProductTierPrices,
  getProductCalculatedListingPrice,
} from "@shopware-pwa/helpers-next";
import SharedProductPrice from "../../shared/SharedProductPrice.vue";
import SwVariantConfigurator from "../../SwVariantConfigurator.vue";
import SwProductAddToCart from "../../SwProductAddToCart.vue";
import {
  CheckIcon,
  TruckIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const router = useRouter();
const alignment = computed(() => getConfigValue("alignment"));

const { taxState, currency } = useSessionContext();

const { product, changeVariant } = useProduct(
  props.content.data.product,
  props.content.data.configuratorSettings || []
);

const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const availableStock = computed(() => product.value?.availableStock ?? 0);
const minPurchase = computed(() => product.value?.minPurchase ?? 0);
const deliveryTime = computed(() => product.value?.deliveryTime);
const restockTime = computed(() => product.value?.restockTime);

const scrollToReviews = async (e: any) => {
  e.preventDefault();
  await router.push({
    hash: '#reviews',
  });
  setTimeout(() => {
    const elements: any = document.getElementsByClassName('product-meta');
    Array.from(elements).forEach((x: any) => {
      if (window.getComputedStyle(x).display !== "none") {
        x?.scrollIntoView();
      }
    })
  }, 100);
}

</script>
<template>
  <div class="md:max-w-[488px] md:ml-auto">
    <h3 class="font-semibold">
      {{ getProductName({ product }) }}
    </h3>
    <div class="flex justify-between mt-2 mb-6">
      <SharedProductPrice
        :product="product"
        class="text-gray-500 text-lg"
      />
      <div class="flex flex-col">
        <a 
          @click="scrollToReviews" class="underline font-medium cursor-pointer"
        >
          <SharedReviews :product="product" :numberOfReviews="(props.content.data as any).totalReviews" />
          {{ $t('read_reviews') }}
        </a>
      </div>
    </div>
    <SwVariantConfigurator
      :product="product"
      :allow-redirect="true"
      @change="changeVariant"
    />
    <div class="flex gap-3">
      <CheckIcon class="text-green-500 h-6 w-6" />
      <div>
        <p class="text-lg font-medium mb-2">
          {{ product.stock }} in stock
        </p>
        <p class="text-base text-gray-500">
          1 day delivery (Order before 3.30 pm)
        </p>
      </div>
    </div>
    <SwProductAddToCart
      class="mt-6"
      :product="product"
    />
    <article class="mt-6 flex flex-col gap-4">
      <div class="flex">
        <TruckIcon class="h-6 w-6 mr-3" />
        <div class="flex-1">
          <h6 class="text-gray-900 mb-2">
            {{ $t('easy_shipping') }}
          </h6>
          <p class="text-gray-500">
            You'll receive dispatch confirmation and an arrival date
          </p>
        </div>
      </div>
      <div class="flex">
        <ArrowsRightLeftIcon class="h-6 w-6 mr-3" />
        <div class="flex-1">
          <h6 class="text-gray-900 mb-2">
            Changed your mind?
          </h6>
          <p class="text-gray-500">
            We offer free returns within 30 days
          </p>
        </div>
      </div>
      <div class="flex">
        <LockClosedIcon class="h-6 w-6 mr-3" />
        <div class="flex-1">
          <h6 class="text-gray-900 mb-2">
            {{ $t('safety') }}
          </h6>
          <p class="text-gray-500">
            It carefully packaged with a personal touch
          </p>
        </div>
      </div>
    </article>
  </div>
  <!-- <div
    v-if="product"
    :class="{
      'h-full flex flex-col': true,
      'justify-start': alignment === 'flex-start',
      'justify-end': alignment === 'flex-end',
      'justify-center': alignment === 'center',
    }"
  >
    <div>
      <SharedPrice
        v-if="price"
        :value="price"
        class="font-bold text-2xl text-gray-900 text-left"
      />
      <div v-if="purchaseUnit && unitName" class="mt-1">
        <span class="font-light"> Content: </span>
        <span class="font-light"> {{ purchaseUnit }} {{ unitName }} </span>
        <span v-if="referencePrice" class="font-light">
          {{ currency?.symbol }} {{ referencePrice?.price }} / /
          {{ referencePrice?.referenceUnit }} {{ referencePrice?.unitName }}
        </span>
      </div>
      <span class="text-indigo-600">
        <template v-if="taxState === 'gross'">
          Prices incl. VAT plus shipping costs
        </template>
        <template v-else> Prices excl. VAT plus shipping costs </template>
      </span>
    </div>
    <div class="mt-4">
      <span v-if="availableStock >= minPurchase && deliveryTime"
        >Available, delivery time {{ deliveryTime?.name }}
      </span>
      <span
        v-else-if="availableStock < minPurchase && deliveryTime && restockTime"
        >Available in {{ restockTime }} day, delivery time
        {{ deliveryTime?.name }}</span
      >
      <span v-else>No longer available</span>
    </div>
    <div class="mt-3 product-detail-ordernumber-container">
      <span class="font-bold text-gray-900"> Product number: </span>
      <span>
        {{ productNumber }}
      </span>
    </div>
  </div> -->
</template>
