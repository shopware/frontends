<script setup lang="ts">
import { computed, unref, onMounted, ref } from "vue";
import { getProductName, getSmallestThumbnailUrl } from "@shopware-pwa/helpers-next";
import type { Product } from "@shopware-pwa/types";
import { useAddToCart, useProductSearchSuggest ,useProductPrice, usePrice, useSessionContext, useProductSearch } from "@shopware-pwa/composables-next";
// TODO: check issue with missing context
import { useProduct } from "@shopware-pwa/composables-next";

const product = ref<Product>();
const { search } = useProductSearch();
onMounted(async () => {
  const productResponse = await search("b2e974a54f8a48949a6397c72d2bffb5", {
    criteria: {
      associations: {
        options: {}
      }
    }
  })
  product.value = productResponse.product;
})

const { addToCart } = useAddToCart(product);
const addToCartProxy = async () => {
  await addToCart();
  console.info(`${product.value.translated.name} has been added to cart`)
};


const { taxState, currency } = useSessionContext();



const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
const { getFormattedPrice, init } = usePrice();
init({
  localeCode: "en-GB",
  currencyCode: "PLN"
})

const referencePrice = computed(
  () => product.value?.calculatedPrice?.referencePrice
);
const productName = computed(() => getProductName({product: unref(product)}));
const manufacturer = computed(() => product.value?.manufacturer?.name);
const productNumber = computed(() => product.value?.productNumber);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const availableStock = computed(() => product.value?.availableStock ?? 0);
const minPurchase = computed(() => product.value?.minPurchase ?? 0);
const deliveryTime = computed(() => product.value?.deliveryTime);
const restockTime = computed(() => product.value?.restockTime);

</script>
<template>
   
   <div class="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
            <div class="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
                <img class="w-full" alt="image of a girl posing" :src="getSmallestThumbnailUrl(product?.cover.media)" />
            </div> 
            <div class="md:hidden">
                <img class="w-full" alt="image of a girl posing" :src="getSmallestThumbnailUrl(product?.cover.media)" />
            </div>
            <div class="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
                <div class="border-b border-gray-200 pb-6">
                    <p class="text-sm leading-none text-gray-600 dark:text-gray-300 ">{{manufacturer}}</p>
                    <h1 class="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">{{ productName }}</h1>
                </div>
                <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                    <p class="text-base leading-4 text-gray-800 dark:text-gray-300">{{ product?.options?.[0]?.group}}</p>
                    <div class="flex items-center justify-center">
                        <p class="text-sm leading-none text-gray-600 dark:text-gray-300">Smoke Blue with red accents</p>
                        <div class="w-6 h-6 bg-gradient-to-b from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer"></div>
                        <img class="dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg2.svg" alt="next">
                        <img class="hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg2dark.svg" alt="next">   
                    </div>
                </div>
                <div class="py-4 border-b border-gray-200 flex items-center justify-between">
                    <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Size</p>
                    <div class="flex items-center justify-center">
                        <p class="text-sm leading-none text-gray-600 dark:text-gray-300 mr-3">38.2</p>
                        
                        <img class="dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg2.svg" alt="next">
                        <img class="hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg2dark.svg" alt="next">  
                    </div>
                </div>
                <button class="dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
                    <img class="mr-3 dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/svg1.svg" alt="location">
                    <img class="mr-3 hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/svg1dark.svg" alt="location">
                    Check availability in store
                </button>
                <div>
                    <p class="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 dark:text-gray-300 mt-7">It is a long established fact that a reader will be distracted by thereadable content of a page when looking at its layout. The point of usingLorem Ipsum is that it has a more-or-less normal distribution of letters.</p>
                    <p class="text-base leading-4 mt-7 text-gray-600 dark:text-gray-300">Product Code: 8BN321AF2IF0NYA</p>
                    <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">Length: 13.2 inches</p>
                    <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">Height: 10 inches</p>
                    <p class="text-base leading-4 mt-4 text-gray-600 dark:text-gray-300">Depth: 5.1 inches</p>
                    <p class="md:w-96 text-base leading-normal text-gray-600 dark:text-gray-300 mt-4">Composition: 100% calf leather, inside: 100% lamb leather</p>
                </div>
                <div>
                    <div class="border-t border-b py-4 mt-7 border-gray-200">
                        <div data-menu class="flex justify-between items-center cursor-pointer">
                            <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Shipping and returns</p>
                            <button class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded" role="button" aria-label="show or hide">
                                <img class="transform dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg4.svg" alt="dropdown">
                                <img class="transform hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg4dark.svg" alt="dropdown">
                            </button>
                        </div>
                        <div class="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 dark:text-gray-300" id="sect">You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are nonrefundable</div>
                    </div>
                </div>
                <div>
                    <div class="border-b py-4 border-gray-200">
                        <div data-menu class="flex justify-between items-center cursor-pointer">
                            <p class="text-base leading-4 text-gray-800 dark:text-gray-300">Contact us</p>
                            <button class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded" role="button" aria-label="show or hide">
                                <img class="transform dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg4.svg" alt="dropdown">
                                <img class="transform hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/productDetail3-svg4dark.svg" alt="dropdown">
                            </button>
                        </div>
                        <div class="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600 dark:text-gray-300" id="sect">If you have any questions on how to return your item to us, contact us.</div>
                    </div>
                </div>
            </div>
        </div>
        
        
    
</template>