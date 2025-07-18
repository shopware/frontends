<script setup lang="ts">
import type { CmsElementBuyBox } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";
import { computed } from "vue";
import {
  useCmsElementConfig,
  usePrice,
  useProduct,
  useProductPrice,
  useSessionContext,
} from "#imports";

const props = defineProps<{
  content: CmsElementBuyBox;
}>();

type Translations = {
  product: {
    previously: string;
    amount: string;
    price: {
      [key: string]: string;
    };
    to: string;
    from: string;
    content: string;
    pricesIncl: string;
    pricesExcl: string;
  };
};

let translations: Translations = {
  product: {
    previously: "Previously",
    amount: "Amount",
    price: {
      label: "Price",
      to: "To",
      from: "From",
    },
    to: "To",
    from: "From",
    content: "Content",
    pricesIncl: "Prices incl. VAT plus shipping costs",
    pricesExcl: "Prices excl. VAT plus shipping costs",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const { getConfigValue } = useCmsElementConfig(props.content);
const alignment = computed(() => getConfigValue("alignment"));
const { taxState, currency } = useSessionContext();
const { product, changeVariant } = useProduct(
  props.content.data.product,
  props.content.data.configuratorSettings || [],
);
const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
const regulationPrice = computed(() => price.value?.regulationPrice?.price);
const { getFormattedPrice } = usePrice();
const referencePrice = computed(
  () => product.value?.calculatedPrice?.referencePrice,
);
const purchaseUnit = computed(() => product.value?.purchaseUnit);
const unitName = computed(() => product.value?.unit?.name);
const productName = computed(() => product.value?.translated?.name || "");
</script>
<template>
    <div v-if="product" :class="{
        'h-full w-full flex flex-col md:w-[36rem]': true,
        'justify-start': alignment === 'flex-start',
        'justify-end': alignment === 'flex-end',
        'justify-center': alignment === 'center',
    }">
        <div class="w-full inline-flex flex-col justify-start items-start gap-8 mt-4">
            <div
                class="md:hidden self-stretch justify-start text-surface-on-surface text-4xl font-normal font-['Noto_Serif'] leading-[60px]">
                {{ productName }}</div>

            <div v-if="tierPrices.length <= 1">
                <SwSharedPrice v-if="isListPrice"
                    class="text-1xl text-secondary-900 basis-2/6 justify-start line-through"
                    :value="price?.listPrice?.price" />
                <SwSharedPrice v-if="unitPrice"
                    class="justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal"
                    :class="{
                        'text-red': isListPrice,
                    }" :value="unitPrice" />
                <div v-if="regulationPrice" class="text-xs flex text-secondary-500">
                    {{ translations.product.previously }}
                    <SwSharedPrice class="ml-1" :value="regulationPrice" />
                </div>
            </div>
            <div v-else>
                <table class="border-collapse table-auto w-full text-sm mb-8">
                    <thead>
                        <tr>
                            <th
                                class="border-b dark:border-secondary-600 font-medium p-4 pl-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left">
                                {{ translations.product.amount }}
                            </th>

                            <th
                                class="border-b dark:border-secondary-600 font-medium p-4 pr-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left">
                                {{ translations.product.price.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-secondary-800">
                        <tr v-for="(tierPrice, index) in tierPrices" :key="tierPrice.label">
                            <td
                                class="border-b border-secondary-100 dark:border-secondary-700 p-4 pl-8 font-medium text-secondary-500 dark:text-secondary-400">
                                <span v-if="index < tierPrices.length - 1">{{
                                    translations.product.to
                                    }}</span><span v-else>{{ translations.product.from }}</span>
                                {{ tierPrice.quantity }}
                            </td>
                            <td
                                class="border-b border-secondary-100 dark:border-secondary-700 p-4 pr-8 font-medium text-current-500 dark:text-secondary-400">
                                {{ getFormattedPrice(tierPrice.unitPrice) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="purchaseUnit && unitName" class="mt-1">
                <span class="font-light"> {{ translations.product.content }}: </span>
                <span class="font-light"> {{ purchaseUnit }} {{ unitName }} </span>
                <span v-if="referencePrice" class="font-light">
                    {{ currency?.symbol }} {{ referencePrice?.price }} / /
                    {{ referencePrice?.referenceUnit }} {{ referencePrice?.unitName }}
                </span>
            </div>
            <span class="text-indigo-600">
                <template v-if="taxState === 'gross'">
                    {{ translations.product.pricesIncl }}
                </template>
                <template v-else> {{ translations.product.pricesExcl }} </template>
            </span>
            <SwVariantConfigurator @change="changeVariant" />
            <SwProductAddToCart :product="product" />
        </div>
    </div>
</template>
