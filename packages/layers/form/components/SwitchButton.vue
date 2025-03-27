
<script setup>
const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  focused: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:checked", "change"]);

const internalChecked = ref(props.checked);

watch(
  () => props.checked,
  (newValue) => {
    internalChecked.value = newValue;
  },
);

const toggleSwitch = () => {
  if (props.disabled) return;

  const newValue = !internalChecked.value;
  internalChecked.value = newValue;

  emit("update:checked", newValue, props.id);

  emit("change", newValue, props.id);
};
</script>
<template>
  <div 
    :class="[
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
      internalChecked ? 'bg-brand-primary' : 'bg-[#cac4d0]',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      focused ? 'ring-2 ring-[#1722f9] ring-offset-2' : ''
    ]"
    @click="toggleSwitch"
  >
    <span 
      :class="[
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        internalChecked ? 'translate-x-6' : 'translate-x-1'
      ]"
    />
  </div>
</template>
