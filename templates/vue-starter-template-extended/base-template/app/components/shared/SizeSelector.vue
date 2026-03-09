<script setup lang="ts">
const props = defineProps<{
  value: number;
}>();

const emit = defineEmits<{
  change: [size: number];
}>();

const state = ref(props.value.toString());

const options = [
  { value: "1", label: "1" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

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
    @change="handleChange"
  />
</template>
