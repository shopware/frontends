<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { getTranslatedProperty } from '@shopware-pwa/helpers-next';
import { Order } from '@shopware-pwa/types';
import { format } from 'date-fns';
import SharedOrderDetail from './SharedOrderDetail.vue';

const { orders } = defineProps<{
  orders: Order[];
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="order of orders"
      class="shadow-sm"
    >
      <Disclosure
        v-slot="{ open }"
      >
        <DisclosureButton
          class="px-4 py-6 text-gray-900 flex gap-8 items-center w-full border border-gray-200"
        >
          <div class="flex flex-col md:flex-row items-start md:items-center md:gap-8">
            <div>
              <p class="text-sm text-left">
                #{{ order.orderNumber }}
              </p>
              <p class="text-left text-xl md:text-2xl">
                {{ format(new Date(order.orderDate), 'yyyy-MM-dd') }}
              </p>
            </div>
            <div>
              <div :class="{
                'text-xs w-[82px] font-medium py-1 leading-5': true,
                'text-white bg-blue-600': order.stateMachineState.technicalName === 'in_progress',
                'text-white bg-red-600': order.stateMachineState.technicalName === 'cancel',
                'text-white bg-green-600': order.stateMachineState.technicalName === 'complete',
                'text-white bg-light-blue-600': order.stateMachineState.technicalName === 'open'
              }">
                {{ getTranslatedProperty(order.stateMachineState, 'name') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-end md:items-center justify-between flex-1 self-stretch">
            <SharedPrice
              class="text-sm font-medium"
              :value="order.amountTotal"
            />
            <div class="flex items-center bg-gray-100 py-2.25 px-4">
              <span class="text-sm font-medium text-gray-700 mr-2">View details</span>
              <ChevronDownIcon
                :class="open ? 'rotate-180 transform' : ''"
                class="h-4 w-4 text-slate-900"
              />
            </div>
          </div>
        </DisclosureButton>
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <DisclosurePanel class="p-6 border border-gray-200 border-t border-t-transparent">
            <SharedOrderDetail :order="order" />
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>
  </div>
</template>
