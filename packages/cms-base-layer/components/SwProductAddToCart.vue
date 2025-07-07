<script setup lang="ts">
import { useCmsTranslations } from "@shopware/composables";
import { getCmsTranslate } from "@shopware/helpers";
import { defu } from "defu";
import { computed, toRefs } from "vue";
import {
  useAddToCart,
  useCartErrorParamsResolver,
  useCartNotification,
  useNotifications,
} from "#imports";
import type { Schemas } from "#shopware";

const { pushSuccess, pushError } = useNotifications();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const props = defineProps<{
  product: Schemas["Product"];
}>();

type Translations = {
  product: {
    addedToCart: string;
    qty: string;
    addToCart: string;
    productNumber: string;
  };
  errors: {
    [key: string]: string;
  };
};

let translations: Translations = {
  product: {
    addedToCart: "has been added to cart.",
    qty: "Qty",
    addToCart: "Add to cart",
    productNumber: "Product number",
  },
  errors: {
    "product-stock-reached":
      "The product {name} is only available {quantity} times",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { product } = toRefs(props);
const { addToCart, quantity } = useAddToCart(product);

const availableStock = computed(() => product.value?.availableStock ?? 0);
const minPurchase = computed(() => product.value?.minPurchase ?? 0);
const deliveryTime = computed(() => product.value?.deliveryTime);
const restockTime = computed(() => product.value?.restockTime);
const productNumber = computed(() => product.value?.productNumber ?? "");

const addToCartProxy = async () => {
  await addToCart();
  const errors = getErrorsCodes();
  for (const element of errors) {
    const { messageKey, params } = resolveCartError(element);
    if (translations.errors[messageKey])
      pushError(getCmsTranslate(translations.errors[messageKey], params));
  }

  if (!errors.length)
    pushSuccess(
      `${props.product?.translated.name} ${translations.product.addedToCart}`,
    );
};
</script>

<template>
  <div class="w-[572px] inline-flex flex-col justify-start items-start gap-8">
    <SwQuantitySelect v-model="quantity" :min="product.minPurchase" :max="product.maxPurchase"
      :steps="product.purchaseSteps" />

    <SwStockInfo :availableStock="availableStock" :minPurchase="minPurchase" :deliveryTime="deliveryTime"
      :restockTime="restockTime" />

    <div class="self-stretch flex flex-col justify-start items-start gap-1">
      <SwButton 
        variant="primary"
        size="medium"
        :disabled="!product?.available"
        block
        data-testid="add-to-cart-button"
        @click="addToCartProxy"
      >
        {{ translations.product.addToCart }}
      </SwButton>
      
      <div class="self-stretch justify-start text-surface-on-surface text-xs font-normal font-['Inter'] leading-none">
        {{ translations.product.productNumber }}: {{ productNumber }}
      </div>
    </div>
  </div>
</template>
