<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  cart: Schemas["Cart"];
}>();

const emit = defineEmits<{
  remove: [id: string];
  updateQuantity: [id: string, quantity: number];
}>();

const { subtotal, totalPrice, shippingCosts } = useCart();

function handleRemoveItem(id: string) {
  emit("remove", id);
}

function handleUpdateQuantity(id: string, quantity: number) {
  emit("updateQuantity", id, quantity);
}
</script>
<template>
  <div class="border border-outline-outline sticky top-2">
    <div class="border-b border-outline-outline-variant">
      <h2 class="text-10 px-6 font-['Noto_Serif']">
        {{ $t("checkout.summary") }}
      </h2>
    </div>
    <div class="p-6 pt-10">
      <div class="divide-y">
        <CheckoutProductTile v-for="item in cart.lineItems" :item="item" :key="item.id" class="py-4" @remove="(id) => handleRemoveItem(id)" @updateQuantity="(id, quantity) => handleUpdateQuantity(id, quantity)" />
      </div>

      <div class="py-4 border-t border-outline-outline-variant flex flex-col gap-1">
        <div class="flex justify-between">
          <div
            class="self-stretch justify-start text-surface-on-surface-variant text-sm font-normal"
          >
            {{ $t("checkout.subtotal") }}
          </div>

          <SharedPrice
            :value="subtotal"
            class="text-surface-on-surface text-sm font-normal"
            data-testid="cart-subtotal"
          />
        </div>

        <div
          class="flex justify-between"
          v-for="shippingCost in shippingCosts"
          :key="shippingCost.shippingMethod?.id ?? Math.random() * 100"
        >
          <div
            class="self-stretch justify-start text-surface-on-surface-variant text-sm font-normal"
          >
            {{ $t("checkout.shippingCosts") }}
          </div>

          <div v-if="shippingCost.shippingCosts?.totalPrice">
            <SharedPrice
              class="text-surface-on-surface text-sm font-normal"
              :value="shippingCost.shippingCosts.totalPrice"
            />
          </div>
        </div>
      </div>
      <div class="pt-4 border-t border-outline-outline-variant flex justify-between">
        <div
          class="self-stretch justify-start text-surface-on-surface text-base font-normal leading-normal"
        >
          {{ $t("checkout.total") }}
        </div>
        <SharedPrice
          :value="totalPrice"
          class="text-right justify-start text-surface-on-surface text-base font-normal leading-normal"
          data-testid="cart-subtotal"
        />
      </div>
    </div>
  </div>
</template>
