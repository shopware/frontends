<script setup lang="ts">
import { OrderLineItem, LineItem } from '@shopware-pwa/types';

const props = defineProps<{
  lineItems: OrderLineItem[] | LineItem[];
  enableActions?: boolean;
  isContainer?: boolean;
  isMiniCart?: boolean;
  preventLastItem?: boolean;
}>();
</script>
<template>
  <ul
    :class="{
      'flex flex-col': true,
      '!gap-0': props.isMiniCart
    }"
  >
    <template v-for="lineItem of props?.lineItems">
      <SharedProductOrder
        :class="{
          'px-4 md:p-6': props.isContainer,
        }"
        :line-item="lineItem"
        :enable-actions="props.enableActions"
        :preventLastItem="props.preventLastItem"
      />
    </template>
  </ul>
</template>
