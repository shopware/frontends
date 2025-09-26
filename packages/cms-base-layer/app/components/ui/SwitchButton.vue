<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  modelValue?: boolean | null;
  name?: string;
  ariaLabel?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}>();

// Declare both camelCase and kebab-case event names so Vue Devtools and templates recognize them
const emits = defineEmits<{
  (e: "update:model-value", v: boolean | null): void;
  (e: "change", v: boolean | null): void;
}>();

const value = computed(() => !!props.modelValue);

const localChecked = ref<boolean>(value.value);
watch(value, (v) => {
  localChecked.value = v;
});

const inputName = props.name ?? "switch-button";
const inputId = `switch-${inputName}`;
const inputRef = ref<HTMLInputElement | null>(null);

const activateByKeyboard = () => {
  inputRef.value?.click();
};
const toggleState = (next?: boolean) => {
  if (props.disabled) return;
  const v = typeof next === "boolean" ? next : !localChecked.value;
  localChecked.value = v;
  emits("update:model-value", v);
  emits("change", v);
};

const activateByClick = (ev?: Event) => {
  ev?.stopPropagation();
  toggleState();
};
</script>

<template>
  <div class="w-full inline-flex flex-col justify-start items-start gap-2">
    <div class="self-stretch inline-flex justify-start items-center gap-3">
      <!-- left label that toggles the input via for="#inputId" -->
      <label :for="inputId"
        class="flex-1 flex justify-start items-center gap-1 text-surface-on-surface text-base font-normal leading-normal cursor-pointer"
        :class="{ 'cursor-not-allowed': disabled }">
        <span v-if="$slots.default">
          <slot />
        </span>
        <span v-else-if="label">{{ label }}</span>
      </label>

      <div class="w-10 h-6 relative">
        <label class="inline-block cursor-pointer" :class="{ 'cursor-not-allowed': disabled }">
          <input ref="inputRef" :id="inputId" type="checkbox" :name="inputName" class="sr-only" v-model="localChecked"
            :disabled="disabled" :aria-label="ariaLabel || undefined" v-bind="$attrs" />
          <span role="switch" :aria-checked="localChecked" :tabindex="disabled ? -1 : 0"
            class="w-10 h-6 relative rounded-full flex-shrink-0 inline-block switch-track cursor-pointer"
            :class="localChecked ? 'bg-brand-secondary switch-track--on' : 'bg-surface-surface-container-highest'"
            @keydown.space.prevent="activateByKeyboard" @click="activateByClick">
            <span class="w-4 h-4 rounded-full absolute switch-knob"
              :style="{ left: localChecked ? '19px' : '4px', top: '4px' }"
              :class="localChecked ? 'bg-brand-on-secondary' : 'bg-surface-on-surface-variant'"></span>
          </span>
        </label>
      </div>
    </div>
    <div v-if="description || $slots.description" class="self-stretch inline-flex justify-start items-center gap-2.5">
      <div class="flex-1 justify-start text-surface-on-surface-variant text-sm font-normal leading-tight">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch-track {
  transition: background-color 180ms ease-in-out, box-shadow 180ms ease-in-out;
}

.switch-track--on {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08);
  /* subtle glow when on */
}

.switch-knob {
  transition: left 180ms cubic-bezier(.2, .9, .2, 1), top 180ms cubic-bezier(.2, .9, .2, 1), background-color 120ms linear;
}

.switch-track:focus {
  outline: none;
}
</style>
