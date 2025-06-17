<script lang="ts" setup>
const model = defineModel<string>({ required: true });
</script>

<template>
  <div>
    <FormBaseInput v-model="model" placeholder="Search">
      <template #rightIcon>
        <Icon
          name="shopware:search-s"
          class="color-surface-on-surface-variant rotate-90 ml-2"
        />
      </template>
    </FormBaseInput>
  </div>
</template>
