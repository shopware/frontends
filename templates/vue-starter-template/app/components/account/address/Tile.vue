<script setup lang="ts">
import type { Schemas } from "#shopware";

defineProps<{
  address: Schemas["CustomerAddress"];
  isDeleting?: boolean;
  isDefaultBillingAddress?: boolean;
  isDefaultShippingAddress?: boolean;
}>();

const emit = defineEmits<{
  delete: [number];
  setAsDefaultBillingAddress: [number];
  setAsDefaultShippingAddress: [number];
}>();

function handleSetAsDefaultBillingAddress(address: Schemas["CustomerAddress"]) {
  emit("setAsDefaultBillingAddress", address.id);
}

function handleSetAsDefaultShippingAddress(
  address: Schemas["CustomerAddress"],
) {
  emit("setAsDefaultShippingAddress", address.id);
}

function handleDeleteAddress(address: Schemas["CustomerAddress"]) {
  emit("delete", address.id);
}
</script>

<template>
  <div
    class="transition-all duration-300 ease-out"
    :class="{
      'opacity-50 pointer-events-none': isDeleting,
      'transform scale-95': isDeleting,
    }"
  >
    <AccountAddressDataSection class="mb-8" :address="address" />
    <div class="flex gap-4">
      <AccountAddressEditButton :disabled="isDeleting" />
      <AccountAddressDeleteButton
        v-if="!isDefaultBillingAddress && !isDefaultShippingAddress"
        :disabled="isDeleting"
        @click="handleDeleteAddress(address)"
      />
    </div>
    <div class="flex flex-col gap-4 mt-8">
      <AccountAddressActionLink
        v-if="!isDefaultBillingAddress"
        :disabled="isDeleting"
        @click="handleSetAsDefaultBillingAddress(address)"
      >
        <Icon class="w-4.5 h-6" name="shopware:file-text" />
        {{ $t("account.address.useAsDefaultBillingAddressButton") }}
      </AccountAddressActionLink>
      <AccountAddressActionLink
        v-if="!isDefaultShippingAddress"
        :disabled="isDeleting"
        @click="handleSetAsDefaultShippingAddress(address)"
      >
        <Icon class="w-6 h-4.5" name="shopware:truck" />
        {{ $t("account.address.useAsDefaultShippingAddressButton") }}
      </AccountAddressActionLink>
    </div>
  </div>
</template>
