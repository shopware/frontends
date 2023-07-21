<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';
import { getSmallestThumbnailUrl, getProductUrl } from "@shopware-pwa/helpers-next";
import SwQuantitySelector from '../SwQuantitySelector.vue';
import { getPath } from '~/helpers';
import {
  TrashIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  lineItem: OrderLineItem | LineItem;
  enableActions?: boolean;
  preventLastItem?: boolean;
}>();
const { addToCart } = useAddToCart(props.lineItem as any);
const { lineItem } = toRefs(props);
const isOpen = inject<boolean>("isSidebarOpen");
const isLoading = ref(false);
const { pushSuccess } = useNotifications();

const price = computed(() => {
  return (props.lineItem as LineItem).price?.unitPrice || (props.lineItem as OrderLineItem)?.priceDefinition?.price
});

const {
  itemOptions,
  removeItem,
  itemRegularPrice,
  itemQuantity,
  isPromotion,
  itemStock,
  changeItemQuantity,
} = useCartItem(lineItem as any);
const { removeFromWishlist } =
  useProductWishlist(lineItem as any);

const quantity = ref();
syncRefs(itemQuantity, quantity);

const updateQuantity = async (quantity: number | undefined) => {
  if (quantity === itemQuantity.value) return;

  isLoading.value = true;

  await changeItemQuantity(Number(quantity));

  isLoading.value = false;
};
const debounceUpdate = useDebounceFn(updateQuantity, 800);

watch(quantity, () => debounceUpdate(quantity.value));

const remove = async () => {
  if (lineItem.value.type !== 'product-wishlist') {
    isLoading.value = true;
    await removeItem();
    isLoading.value = false;
  } else {
    isLoading.value = true;
    await removeFromWishlist();
    isLoading.value = false;
  }
};

const addToCartProxy = async () => {
  await addToCart();
  pushSuccess(`${(props.lineItem as any)?.translated?.name} has been added to cart.`);
};

</script>
<template>
  <li 
    :class="{
      'relative py-6 border-b border-b-gray-200 flex': true,
      'last:border-0 last:pb-0': !preventLastItem
    }"
  >
    <div
      v-if="['product', 'product-wishlist'].includes(lineItem.type ?? '')"
      class="shrink-0 aspect-[2/3] w-[7.5rem] overflow-hidden bg-gray-200 mr-4 md:mr-6"
    >
      <nuxt-link :to="getProductUrl(lineItem as any)" @click="isOpen = false">
        <nuxt-img
          :src="getPath(getSmallestThumbnailUrl(lineItem.cover) ?? '')"
          :alt="lineItem.label || ''"
          class="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </nuxt-link>
    </div>
    <div>
      <component :is="lineItem.type !== 'promotion' ? 'nuxt-link' : 'span'" :to="getProductUrl(lineItem as any)" @click="isOpen = false" class="text-md text-gray-900 font-medium mb-2 block">
        {{ lineItem.label }}
      </component>
      <div class="gap-2 text-sm mb-4">
      <SharedPrice
        :value="price"
        data-testid="cart-subtotal"
      />
      </div>
      <div class="flex flex-col gap-1 mb-4">
        <p v-for="option of (lineItem.payload as any)?.options" class="text-sm text-gray-500">
          {{option.group}}: {{option.option}}
        </p>
      </div>
      <template v-if="lineItem.type === 'product'">
        <p v-if="!enableActions" class="text-sm text-gray-500">
          Quantity: {{lineItem.quantity}}
        </p>
        <div v-else>
          <SwQuantitySelector 
            class="!h-[38px] !w-[108px]" 
            v-model="quantity"
            :min="(lineItem as any).quantityInformation.minPurchase"
            :max="(lineItem as any).quantityInformation.maxPurchase"
          />
        </div>
      </template>
      <template v-if="lineItem.type === 'product-wishlist'">
        <button
          @click="addToCartProxy"
          class="mt-3 w-[175px] flex text-white items-center justify-center px-5 py-2.25 text-base font-medium text-white shadow-sm bg-gray-800"
        >
          {{ $t('add_to_cart') }}
        </button>
      </template>
    </div>
    <TrashIcon v-if="enableActions" class="shrink-0 cursor-pointer text-gray-700 ml-auto h-6 w-6" @click="remove" />
  </li>
</template>