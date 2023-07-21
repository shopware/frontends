<script setup lang="ts">
import {
  TruckIcon,
  LockClosedIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  isColumn?: boolean;
}>();

const information = [
  {
    title: 'easy_shipping',
    description: `easy_shipping_desc`,
    icon: TruckIcon
  },
  {
    title: 'change_your_mind',
    description: 'change_your_mind_desc',
    icon: ArrowsRightLeftIcon
  },
  {
    title: 'safety',
    description: 'safety_desc',
    icon: LockClosedIcon
  }
];

</script>
<template>
  <div :class="{
    'flex gap-4': true,
    'flex-col': props.isColumn,
    'flex-col md:flex-row': !props.isColumn,
  }">
    <div v-for="item of information" class="flex flex-1" :key="item.title">
      <component :is="item.icon" class="h-6 w-6 mr-3" />
      <div class="flex-1">
        <h6 class="text-gray-900 mb-2">{{ $t(item.title) }}</h6>
        <p class="text-gray-500">{{ $t(item.description) }}</p>
      </div>
    </div>
  </div>
</template>