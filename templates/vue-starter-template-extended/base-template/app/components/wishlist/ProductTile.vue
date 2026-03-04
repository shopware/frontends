<script setup lang="ts">
import { getSmallestThumbnailUrl } from "@shopware/helpers";
import type { Schemas } from "#shopware";

const ELEMENT_WIDTH = 310;
const ELEMENT_HEIGHT = 315;

const { product } = defineProps<{
  product: Schemas["Product"];
}>();

const { addProduct } = useCart();
const { removeFromWishlist } = useProductWishlist(product.id);
const { pushError, pushSuccess } = useNotifications();
const { t } = useI18n();

const addingProducts = ref(false);

async function handleAddToCart() {
  try {
    addingProducts.value = true;

    await addProduct({ id: product.id, quantity: 1 });

    pushSuccess(t("account.messages.productsAdded"));
  } catch (error) {
    console.error(error);
    pushError(t("messages.error"));
  } finally {
    addingProducts.value = false;
  }
}
</script>
<template>
  <div
    class="flex flex-col gap-4 relative"
    :style="`width: ${ELEMENT_WIDTH}px;`"
  >
    <ProductWishlistIcon
      @click="removeFromWishlist"
      :isSelected="true"
      class="!absolute top-4 right-4"
    />

    <NuxtImg
      :src="getSmallestThumbnailUrl(product.cover?.media)"
      :alt="`${product.name} item`"
      fit="inside"
      class="object-cover"
      :style="`height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`"
    />

    <div
      class="text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9"
    >
      {{ product.name }}
    </div>
    <div class="mt-auto flex flex-col gap-4">
      <SharedPrice
        class="justify-start text-surface-on-surface text-base font-bold leading-6"
        :value="product.calculatedPrice?.totalPrice"
      />

      <FormBaseButton
        class="mt-auto"
        :label="$t('product.addToCart')"
        @click="handleAddToCart"
      />
    </div>
  </div>
</template>
