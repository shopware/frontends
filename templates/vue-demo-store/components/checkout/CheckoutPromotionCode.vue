<script setup lang="ts">
const { appliedPromotionCodes, addPromotionCode, removeItem } = useCart();

const showPromotionCodes = computed(
  () => appliedPromotionCodes.value.length > 0
);

const promoCode = ref("");
</script>

<template>
  <div>
    <div class="mb-4">
      <input
        v-model="promoCode"
        type="text"
        name="promoCode"
        placeholder="Enter promo code"
        class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full"
        @keyup.enter="addPromotionCode(promoCode)"
      />
    </div>
    <div v-if="showPromotionCodes">
      <div>Applied promo codes:</div>
      <ul role="list" class="text-sm pl-0">
        <li
          v-for="appliedPromotionCode in appliedPromotionCodes"
          :key="appliedPromotionCode.id"
          class="flex justify-between text-gray-600 border-b py-4"
        >
          <span>{{ appliedPromotionCode.label }}</span>
          <button
            class="text-brand-dark"
            type="button"
            @click="removeItem(appliedPromotionCode)"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
