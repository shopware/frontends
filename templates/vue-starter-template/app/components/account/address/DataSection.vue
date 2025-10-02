<script setup lang="ts">
import type { Schemas } from "#shopware";

defineProps<{
  address: Schemas["CustomerAddress"];
}>();
</script>
<template>
  <div class="flex flex-col gap-2">
    <SharedDataTextRow>
      {{ address.firstName }} {{ address.lastName }}
    </SharedDataTextRow>

    <SharedDataTextRow>
      {{ address.street }}
    </SharedDataTextRow>

    <SharedDataTextRow>
      {{ address.zipcode }} {{ address.city }}
    </SharedDataTextRow>

    <SharedDataTextRow>
      {{ address.country?.translated.name }}
    </SharedDataTextRow>
  </div>
</template>
