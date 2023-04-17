<script setup lang="ts">
export type SharedModal = {
  visible: boolean;
  open: () => void;
  close: () => void;
};

const { visible, close } = inject<SharedModal>("modal") as SharedModal;
</script>

<template>
  <transition
    enter-active-class="transition ease-out duration-200 transform"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200 transform"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
      :class="[visible ? 'block' : 'hidden']"
      @click="close"
    >
      <div
        class="flex items-start justify-center min-h-screen pt-24 text-center"
      >
        <transition
          enter-active-class="transition ease-out duration-300 transform "
          enter-from-class="opacity-0 translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
        >
          <div
            class="bg-white rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/2"
            role="dialog"
            ref="modal"
            aria-modal="true"
            aria-labelledby="modal-headline"
            id="modal-content"
          ></div>
        </transition>
      </div>
    </div>
  </transition>
</template>
