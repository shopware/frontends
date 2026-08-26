<script setup lang="ts">
import { getProductRoute, getSmallestThumbnailUrl } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const ELEMENT_WIDTH = 310;
const ELEMENT_HEIGHT = 315;

const { product } = defineProps<{
  product: Schemas["Product"];
}>();

const emit = defineEmits<{
  removed: [];
}>();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const { addProduct } = useCart();
const { removeFromWishlist } = useProductWishlist(product.id);
const { pushError, pushSuccess } = useNotifications();
const { t } = useI18n();

const addingProducts = ref(false);
const removing = ref(false);

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

async function handleRemoveFromWishlist() {
  if (removing.value) return;

  try {
    removing.value = true;

    await removeFromWishlist();

    emit("removed");
  } catch (error) {
    console.error(error);
    pushError(t("messages.error"));
  } finally {
    removing.value = false;
  }
}
</script>
<template>
  <div
    class="flex flex-col gap-4 relative"
    :style="`width: ${ELEMENT_WIDTH}px;`"
  >
    <ProductWishlistIcon
      @click="handleRemoveFromWishlist"
      :isSelected="true"
      :disabled="removing"
      :aria-label="$t('product.removeFromWishlist')"
      class="!absolute top-4 right-4"
    />

    <NuxtLink :to="formatLink(getProductRoute(product))">
      <NuxtImg
        :src="getSmallestThumbnailUrl(product.cover?.media)"
        :alt="`${product.name} item`"
        fit="inside"
        class="object-cover"
        :style="`height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`"
      />
    </NuxtLink>

    <NuxtLink
      :to="formatLink(getProductRoute(product))"
      class="text-surface-on-surface text-2xl font-normal font-['Noto_Serif'] leading-9"
    >
      {{ product.translated.name }}
    </NuxtLink>
    <div class="mt-auto flex flex-col gap-4">
      <SharedPrice
        class="justify-start text-surface-on-surface text-base font-bold leading-6"
        :value="product.calculatedPrice?.totalPrice"
      />

      <FormBaseButton
        class="mt-auto"
        :label="$t('product.addToCart')"
        :loading="addingProducts"
        @click="handleAddToCart"
      />
    </div>
  </div>
</template>
