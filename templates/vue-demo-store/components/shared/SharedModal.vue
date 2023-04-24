<script setup lang="ts">
const props = defineProps<{
  controller: ReturnType<typeof useModal>;
}>();

const { isOpen, close } = props.controller;

const { escape } = useMagicKeys();

watch(escape, () => {
  isOpen.value && close();
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
        v-show="isOpen"
        @click="close"
      >
        <div
          class="flex items-start justify-center min-h-screen pt-1/3 text-center"
        >
          <Transition
            enter-active-class="transition ease-out duration-500 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/2"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              id="modal-content"
              v-if="isOpen"
            >
              <slot></slot>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
