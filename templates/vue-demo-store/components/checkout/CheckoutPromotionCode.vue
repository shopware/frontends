<script setup lang="ts">
import type { Schemas } from "#shopware";
const { appliedPromotionCodes, addPromotionCode, removeItem } = useCart();
const { getErrorsCodes } = useCartNotification();
const { pushError } = useNotifications();
const { t } = useI18n();

const addPromotionCodeHandler = async (code: string) => {
  await addPromotionCode(code);
  getErrorsCodes()?.forEach((element) => {
    pushError(t(`errors.${element.messageKey}`, { ...element }));
  });
  promoCode.value = "";
};

const removeItemHandler = (appliedPromotionCode: Schemas["LineItem"]) => {
  removeItem(appliedPromotionCode);
  getErrorsCodes()?.forEach((element) => {
    pushError(t(`errors.${element.messageKey}`, { ...element }));
  });
};

const showPromotionCodes = computed(
  () => appliedPromotionCodes.value.length > 0,
);

const promoCode = ref("");
</script>

<template>
  <div>
    <div class="mb-4">
      <div class="flex gap-3">
        <input
          v-model="promoCode"
          type="text"
          name="promoCode"
          :placeholder="$t('form.promoCodePlaceholder')"
          class="border rounded-md py-2 px-4 border-solid border-1 border-cyan-600 w-full"
        />
        <button
          class="text-white bg-primary-500 hover:bg-primary-600 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md"
          @click="addPromotionCodeHandler(promoCode)"
        >
          Add
        </button>
      </div>
    </div>
    <div v-if="showPromotionCodes">
      <div>{{ $t("checkout.promoCode.label") }}:</div>
      <ul role="list" class="text-sm pl-0">
        <li
          v-for="appliedPromotionCode in appliedPromotionCodes"
          :key="appliedPromotionCode.id"
          class="flex justify-between text-secondary-600 border-b py-4"
        >
          <span>{{ appliedPromotionCode.label }}</span>
          <button
            class="text-dark"
            type="button"
            @click="removeItemHandler(appliedPromotionCode)"
          >
            {{ $t("checkout.promoCode.remove") }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
