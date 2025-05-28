<script lang="ts" setup>
const search = ref("");
</script>

<template>
  <div>
    <FormBaseInput v-model="search" placeholder="Search">
      <template #rightIcon>
        <Icon
          name="shopware:search-s"
          class="color-surface-on-surface-variant rotate-90 ml-2"
        />
      </template>
    </FormBaseInput>
  </div>
</template>
