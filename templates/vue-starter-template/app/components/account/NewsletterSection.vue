<script setup lang="ts">
const model = defineModel<boolean>({
  required: true,
});

const { disabled = false, confirmationNeeded = false } = defineProps<{
  disabled?: boolean;
  confirmationNeeded?: boolean;
}>();
</script>

<template>
  <div>
    <FormCheckbox
      v-model="model"
      :label="$t('account.overview.newsletter.subscriptionLabel')"
      :disabled
    />
    <p v-if="confirmationNeeded" class="text-sm text-states-error mb-2">
      {{ $t("account.overview.newsletter.confirmationNeeded") }}
    </p>
  </div>
</template>
