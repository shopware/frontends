<script setup lang="ts">
const props = defineProps<{
  controller: ReturnType<typeof useModal>;
}>();

const { controller } = toRefs(props);
const { isOpen, close } = controller.value;

const { escape } = useMagicKeys();

watch(escape, () => {
  isOpen.value && close();
});

const modalContentElement = ref();
onClickOutside(modalContentElement, () => close());
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
        v-show="isOpen"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
      >
        <div
          class="flex items-center justify-center min-h-screen lg:-mt-3% text-center"
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
              v-if="isOpen"
              id="modal-content"
              ref="modalContentElement"
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl p-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <slot></slot>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
