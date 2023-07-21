<script setup lang="ts">
import { RouterLink } from "vue-router";
import SharedProductOrders from '../../components/shared/SharedProductOrders.vue';
import SharedValueProposition from '../../components/shared/SharedValueProposition.vue';
import { ShopwareSearchParams } from "@shopware-pwa/types";
import { searchProducts } from "@shopware-pwa/api-client";

const defaultConfig = ref<any>({
  "type": "product-slider",
  "slot": "productSlider",
  "config": {
    "border": {
      "value": false,
      "source": "static"
    },
    "rotate": {
      "value": false,
      "source": "static"
    },
    "boxLayout": {
      "value": "standard",
      "source": "static"
    },
    "elMinWidth": {
      "value": "300px",
      "source": "static"
    },
    "navigation": {
      "value": true,
      "source": "static"
    },
    "displayMode": {
      "value": "standard",
      "source": "static"
    },
    "verticalAlign": {
      "value": null,
      "source": "static"
    },
  },
  "data": {
    "products": [],
  },
});

const { apiInstance } = useShopwareContext();
const isAddDiscountCode = ref<boolean>();
const discountCode = ref<string>();

const getOtherProducts = async (
  criteria?: Partial<ShopwareSearchParams>,
) => {
  // get dummy products from server
  try {
    const response = await searchProducts(criteria, apiInstance);
    defaultConfig.value.data.products = response.elements;
  } catch (e) {
    throw e;
  }
}

const { cartItems, cart, subtotal, totalPrice, shippingTotal, addPromotionCode } = useCart();

const handleSubmitPromotionCode = () => {
  if (discountCode.value) {
    addPromotionCode(discountCode.value);
  }
}

const hasItems = computed(() => cartItems.value.length > 0);

onMounted(async () => {
  await getOtherProducts({
    limit: 6,
    query: 'M'
  });
});

const promotionErrors = computed(() => {
  const errors = cart.value?.errors;
  const promotionErrTemp: any[] = [];
  if (!discountCode.value || !isAddDiscountCode.value) return [];
  if (errors) {
    const getErrors = Object.keys(errors).filter(x => x.startsWith('promotion'));
    getErrors.forEach(x => {
      if ((errors[x] as any)?.promotionCode === discountCode.value) {
        promotionErrTemp.push(errors[x]);
      }
    })
  }
  return promotionErrTemp;
})

</script>

<script lang="ts">
export default {
  name: "CartPage",
};
</script>

<template>
  <div class="container">
    <h2 v-if="hasItems" class="mt-16 mb-12 text-3xl font-normal md:text-4xl">
      {{ $t('shopping_bag') }}
    </h2>
    <div
      v-if="hasItems"
      class="flex flex-col md:flex-row gap-12 mb-24 md:mb-20"
    >
      <SharedProductOrders
        :enable-actions="true"
        class="flex-1"
        :line-items="cartItems || []"
      />
      <aside class="w-full md:w-1/2 md:max-w-[469px]">
        <SharedOrdersSummary :show-title="true" :shipping-estimate="true">
          <template #action>
            <RouterLink
              class="flex items-center justify-center mt-8 px-6 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
              to="/checkout"
              data-testid="cart-checkout-link"
            >
              {{ $t('go_to_checkout') }}
            </RouterLink>
          </template>
        </SharedOrdersSummary>
        <div class="mt-6">
          <SharedValueProposition :is-column="true" />
        </div>
      </aside>
    </div>
    <div v-else class="mt-40 flex-1 h-full items-center text-center flex flex-col justify-center">
      <h4 class="mb-2 font-medium text-2xl text-dark-primary">{{ $t('your_cart_empty') }}</h4>
      <p class="mb-6 text-base text-gray-500">{{  $t('your_cart_empty_desc') }}</p>
      <div>
        <nuxt-link to="/" class="bg-gray-100 shadow-sm px-6 py-3 text-base font-medium">{{ $t('start_shopping') }}</nuxt-link>
      </div>
    </div>
    <div
      v-if="defaultConfig.data?.products?.length"
      class="mb-27.5 md:mb-47"
    >
      <h4 class="text-lg md:text-2xl text-center mb-6 md:mb-8">
        {{ $t('other_products') }}
      </h4>
      <CmsElementProductSlider :content="defaultConfig" />
    </div>
  </div>
</template>
