<script setup lang="ts">
import type { Schemas } from "#shopware";
const { address } = defineProps<{
  address: Omit<Schemas["CustomerAddress"], "id" | "customerId">;
}>();
</script>
<template>
  <div
    class="p-4 bg-brand-secondary inline-flex flex-col justify-start items-start"
  >
  <div>  
    <div class="text-surface-on-surface text-base">
      {{ address.firstName }} {{ address.lastName }}
    </div>
    <div class="text-surface-on-surface text-base">
      {{ address.street }}
    </div>
    <div class="text-surface-on-surface text-base">
      {{ address.zipcode }} {{ address.city }}
    </div>
    <div class="text-surface-on-surface text-base">
      {{ address.country?.translated.name }}
    </div>
    </div>
    <div>[ADD BUTTON]</div>
  </div>
</template>
