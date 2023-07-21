<script setup lang="ts">
import {
  XMarkIcon,
} from '@heroicons/vue/24/solid';
import { getCheckoutCartLineItemEndpoint, getProducts } from "@shopware-pwa/api-client";
import { ClientApiError, Product } from "@shopware-pwa/types";

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();
const isLoading = ref();
const { apiInstance } = useShopwareContext();
const { items } = useWishlist();
const products = ref<any[]>([]);
const { refreshCart } = useCart();
const isAddingCart = ref();

const addAllToCart = async () => {
  try {
    isAddingCart.value = true;
    const productsTemp = items.value.map(x => (
      {
        quantity: 1,
        type: "product",
        referencedId: x,
        id: x,
      })
    );
    await apiInstance.invoke.post(
      getCheckoutCartLineItemEndpoint(),
      {
        items: productsTemp,
      }
    );
    await refreshCart();
    emits('close');
  } finally {
    isAddingCart.value = false;
  }
}

const loadProductsByItemIds = async (itemIds: string[]): Promise<void> => {
  isLoading.value = true;

  try {
    const result = await getProducts(
      {
        ids: itemIds || items.value,
        associations: {
          options: {
            associations: {
              group: {}
            }
          }
        },
      },
      apiInstance
    );

    if (result) {
      products.value = result.elements.map((x: Product) => ({
        ...x,
        label: x.translated?.name,
        cover: x.cover.media,
        type: 'product-wishlist',
        price: x.calculatedPrice,
        payload: {
          options: x.options?.map((y: any) => ({
            group: (y.group as any)?.translated?.name,
            option: y.translated?.name,
          }))
        }
      }));
    }
  } catch (error) {
    console.error(
      "[wishlist][loadProductsByItemIds]",
      (error as ClientApiError).messages
    );
  }

  isLoading.value = false;
};

watch(
  items,
  (items, oldItems) => {
    if (items.length !== oldItems?.length) {
      products.value = products.value.filter(({ id }) => items.includes(id));
    }
    if (!items.length) {
      return;
    }
    loadProductsByItemIds(items);
  },
  {
    immediate: true,
  }
);

</script>
<template>
  <div class="w-full pointer-events-auto h-full">
    <div class="flex h-full w-full flex-col bg-white shadow-xl py-6 px-4 sm:p-6">
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between">
          <h2
            id="slide-over-title"
            class="text-lg capitalize font-medium text-gray-900 py-0"
          >
            {{ $t('wishlist') }} ({{ items?.length ?? 0 }})
          </h2>
          <div class="ml-3 flex h-7 items-center">
            <button
              type="button"
              class="-m-2 p-2 text-gray-700"
              @click="emits('close')"
            >
              <span class="sr-only">Close panel</span>
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="mt-4 w-full h-full">
          <div class="flex animate-pulse flex-col items-top h-full space-y-5">
            <div class="w-35 bg-gray-300 h-8 rounded-md" />
            <div class="w-20 bg-gray-300 h-6 rounded-md" />
            <div class="w-full bg-gray-300 h-10 rounded-md" />
          </div>
        </div>

        <div v-else-if="!items.length" class="flex-1 min-h-0 text-center flex flex-col justify-center">
          <h4 class="mb-2 font-medium text-2xl text-dark-primary">{{$t('your_cart_empty')}}</h4>
          <p class="mb-6 text-base text-gray-500">{{$t('your_cart_empty_desc')}}</p>
          <nuxt-link to="/" @click="emits('close')" class="bg-gray-100 shadow-sm px-6 py-3 text-base font-medium">{{ $t('start_shopping') }}</nuxt-link>
        </div>

        <div v-else class="flex flex-col flex-1 min-h-0 gap-4 sm:gap-6 mt-6">
          <div class="flex-1 min-h-0 overflow-y-auto -mr-6">
            <SharedProductOrders class="flex-1 -mt-6 pr-6" :isMiniCart="true" :enableActions="true" :lineItems="products || []" :isAllProducts="true" />
          </div>
          <div class="flex flex-col mt-auto">
            <div class="flex flex-col">
              <button
                class="mt-3 flex text-white items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
                @click="addAllToCart"
                :disabled="isAddingCart"
              >
                {{ $t('add_all_to_cart') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
