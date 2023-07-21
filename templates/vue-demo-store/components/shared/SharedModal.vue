<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue';

export type SharedModal = {
  modalContent: string;
  modalProps: {
    position?: string
  } | null;
  open: (component: string, props?: object | null) => void;
  close: () => void;
};

const { close, modalContent, modalProps } = inject<SharedModal>(
  "modal"
) as SharedModal;

const animation = computed(() => {
  if (unref(modalProps)?.position === 'side') {
    return {
      'enter': 'duration-300 ease-out',
      'enter-from': 'translate-x-full',
      'enter-to': 'translate-x-0',
      'leave': 'duration-200 ease-in',
      'leave-from': 'translate-x-0',
      'leave-to': 'translate-x-full',
    }
  } else {
    return {
      'enter': 'duration-300 ease-out',
      'enter-from': 'translate-y-full sm:opacity-0',
      'enter-to': 'translate-y-0 sm:opacity-100',
      'leave': 'duration-200 ease-in',
      'leave-from': 'translate-y-0 sm:opacity-100',
      'leave-to': 'translate-y-full sm:opacity-0',
    }
  }
})
</script>

<template>
  <TransitionRoot
    :show="!!modalContent.length"
    appear
    as="template"
  >
    <Dialog
      as="div" 
      class="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        v-bind="animation"
      >
        <DialogPanel 
          class="flex flex-col z-60 fixed overflow-y-auto bg-white sm:ring-1 sm:ring-gray-900/10"
          :class="{
            'w-full sm:max-w-lg bottom-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 h-max max-h-100vh sm:max-h-90vh': modalProps?.position !== 'side',
            'w-full sm:max-w-[448px] top-0 right-0 bottom-0': modalProps?.position === 'side',
          }"
        >
          <component :is="modalContent" v-bind="modalProps" @close="close" />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
