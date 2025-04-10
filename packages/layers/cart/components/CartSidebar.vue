<script setup lang="ts">
import { useBreadcrumbs } from "@shopware/composables";

// Clear breadcrumbs
const { clearBreadcrumbs } = useBreadcrumbs();
clearBreadcrumbs();

// Use our custom cart composable
const {
  // isOpen,
  // closeCart,
  cartItemCount,
  items,
  subtotal,
  shipping,
  total,
  isEmpty,
  handleQuantityChange,
  handleRemoveItem,
} = useCartSidebarComponent();

const { isOpen, closeCart } = useNuxtApp().$cartSidebar;
</script>

<template>
  <div>
    <!-- Sidebar Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-90"
      @click="closeCart"
    ></div>
    
    <!-- Sidebar -->
    <div 
      :class="`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-surface-surface z-100 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`"
    >
      <!-- Header -->
      <div class="p-4 border-b border-outline-outline-variant flex items-center justify-between">
        <h2 class="text-scale-04 font-medium text-surface-on-surface">Your Cart ({{ cartItemCount }})</h2>
        <button 
          @click="closeCart"
          class="h-9 w-9 rounded-md flex items-center justify-center hover:bg-surface-surface-variant"
        >
          <div class="i-carbon-close-large h-5 w-5" />
          <span class="sr-only">Close</span>
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4 h-[calc(100vh-65px)] overflow-y-auto">
        <div v-if="isEmpty" class="flex flex-col items-center justify-center h-40 text-center">
          <div class="i-carbon-shopping-bag h-10 w-10 text-outline-outline mb-2"></div>
          <p class="text-outline-outline">Your cart is empty</p>
        </div>
        
        <template v-else>
          <div class="divide-y divide-outline-outline-variant">
            <CartItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              @quantity-change="handleQuantityChange"
              @remove="handleRemoveItem"
            />
          </div>
          
          <div class="h-px bg-outline-outline-variant my-4"></div>
          
          <CartSummary 
            :subtotal="subtotal"
            :shipping="shipping"
            :total="total"
          />
          
          <button @click="() => {closeCart(); $router.push('checkout')}" class="w-full mt-6 py-2 px-4 bg-brand-primary hover:bg-brand-on-primary-container text-white rounded-md">
            Checkout
          </button>
        </template>
      </div>
    </div>
  </div>
</template>