<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <FormBaseButton
    variant="tertiary"
    :disabled="disabled"
    :class="{
      'opacity-50 pointer-events-none': disabled,
    }"
  >
    <div class="flex gap-2 items-center">
      <Icon name="shopware:trash-s" />
      {{ $t("account.address.deleteAddressButton") }}
    </div>
  </FormBaseButton>
</template>
