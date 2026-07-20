<script setup lang="ts">
const props = defineProps<{
  value: number;
}>();

const emit = defineEmits<{
  change: [size: number];
}>();

const state = ref(props.value.toString());

const options = PAGE_SIZE_OPTIONS.map((size) => ({
  value: size.toString(),
  label: size.toString(),
}));

function handleChange() {
  emit("change", Number(state.value));
}

watch(
  () => props.value,
  (newValue) => {
    state.value = newValue.toString();
  },
);
</script>
<template>
  <FormDropdownField
    id="page-size"
    v-model="state"
    :options
    variant="control"
    @change="handleChange"
  />
</template>
